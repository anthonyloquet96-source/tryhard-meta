-- Tour de sécurité du 01/11/2026 : les repères par rang (metric_references) sont calculés en partie avec la clé Riot de
-- développement et réservés au test privé (décision d'Anthony du 27/10). La politique « references_read » les ouvrait à tout
-- compte connecté, or les inscriptions Supabase sont ouvertes : n'importe qui pouvait les lire directement avec la clé publique.
-- Le Worker les lit avec la clé de service (qui ignore la sécurité par ligne) et n'a donc pas besoin de cette politique.
-- Sans politique, la table reste protégée (RLS active) : plus aucune lecture ni écriture avec la clé publique.
drop policy if exists references_read on public.metric_references;
