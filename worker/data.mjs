// Données privées du coach (repères Diamant+, builds, statistiques et repères par champion) lues depuis le bucket privé
// « coach-data » de Supabase Storage, et non plus embarquées dans le bundle du Worker (bloc B de la todo du 01/11/2026).
// Pourquoi : ces fichiers viennent de la clé Riot de développement et restent hors git ; les embarquer obligeait à déployer
// depuis le poste qui les possède. Ici le Worker se déploie sans eux (GitHub Actions), et les données se mettent à jour à part
// (worker/put-data.mjs). Le manifeste porte leur statut : published false = test privé seulement, jamais exposées sans accord Riot.
// Cache en mémoire par instance du Worker (TTL), ancienne version gardée si Supabase ne répond pas.

export const FILES = ["benchmarks", "champstats", "builds", "champrefs"];
const TTL_MS = 15 * 60e3;

export function createDataLoader({ url, serviceKey, fetchImpl = fetch, ttlMs = TTL_MS, now = () => Date.now(), log = () => {} } = {}) {
  let cache = null, loadedAt = 0, pending = null;
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
  const one = async name => {
    const r = await fetchImpl(`${url}/storage/v1/object/coach-data/${name}.json`, { headers });
    if (!r.ok) throw Object.assign(new Error(`coach-data/${name}.json : HTTP ${r.status}`), { status: r.status });
    return r.json();
  };
  const refresh = async () => {
    try {
      const manifest = await one("manifest").catch(() => null);
      const values = await Promise.all(FILES.map(f => one(f).catch(e => { log(`donnée absente : ${f} (${e.message})`); return null; })));
      // Un fichier en panne garde sa version précédente plutôt que de disparaître
      cache = { manifest: manifest ?? cache?.manifest ?? null, ...Object.fromEntries(FILES.map((f, i) => [f, values[i] ?? cache?.[f] ?? null])) };
      loadedAt = now();
    } catch (e) { log(`données du coach non rechargées : ${e.message}`); if (!cache) cache = { manifest: null, ...Object.fromEntries(FILES.map(f => [f, null])) }; }
    pending = null;
    return cache;
  };
  return {
    // Données courantes : chargées à la première demande, rafraîchies en arrière-plan après le TTL
    async get() {
      if (!url || !serviceKey) return { manifest: null, ...Object.fromEntries(FILES.map(f => [f, null])) };
      if (!cache) return pending || (pending = refresh());
      if (now() - loadedAt > ttlMs && !pending) pending = refresh();
      return cache;
    },
    loadedAt: () => loadedAt,
  };
}
