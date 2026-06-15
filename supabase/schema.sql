-- Esquema de la tabla de leads
-- Ejecutar en AMBOS proyectos Supabase: garaje-prod y garaje-test

create table if not exists public.leads (
  id                     uuid primary key default gen_random_uuid(),
  nombre                 text not null,
  apellido               text not null,
  email_empresa          text not null,
  empresa                text not null,
  cargo                  text,
  tamano_equipo          text,
  acepta_comunicaciones  boolean not null default false,
  utm_source             text,
  utm_medium             text,
  utm_campaign           text,
  session_id             text,
  created_at             timestamptz not null default now()
);

-- Índice para consultas por fecha (panel de leads)
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS: activado. Las inserciones se hacen server-side con la service_role key,
-- que BYPASSEA RLS, así que no abrimos políticas de insert al rol anon.
alter table public.leads enable row level security;

-- (Opcional) política de lectura solo para usuarios autenticados, si más adelante
-- montas un panel propio. De momento la lectura va por el dashboard de Supabase.
-- create policy "leads_select_authenticated"
--   on public.leads for select
--   to authenticated
--   using (true);
