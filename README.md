mediclean1234!

npx create-next-app@latest

Inlucded:

- typescript
- ESLint
- TailwindCSS
- App Router

Installed:
npm install --save-dev prettier prettier-plugin-tailwindcss

npx tailwindcss-cli@latest init

npx shadcn@latest init

npm install react-icons

supabase.com

- create project
- api key

npm install @supabase/ssr @supabase/supabase-js

Inside .env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

create supabase folder (inside lib)

- create browser.ts and server.ts
  https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=environment&environment=client

for OAuth:
create callback folder (inside auth)

- create route.ts
  https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client

# Prisma

npm install prisma @prisma/client
npx prisma init
Add .env file
Update schema.prisma
npx prisma generate
npx prisma migrate dev --name migration1 (create a migration with name migration1)

npx prisma studio // for visualization

Add policies to tables in supabase
In supabase: Storage -> New bucket (for images) -> Add policy

# Generate types

npx supabase login
npx supabase gen types typescript --project-id sfnpgydezdiiexmftraz --schema public > types_db.ts

# If you want to be able to call Rest APIs from Supabase.

Example In Postman: base_url/rest/v1/products
Run this in SQL Editor (Supabase)

- Docs https://supabase.com/docs/guides/api/using-custom-schemas

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

Then add policy to your Table:
Example: Policy Command (Select) -> Target Roles (anon + authenticated)

<!-- # Trying DaisyUI
npm install daisyui
comment out :root and .dark inside global.css -->

Shadcn added dark mode

TO DO:
Find out how to create custom roles in supabase.

continue page protection role
https://www.youtube.com/watch?v=WUD1RLSd3U0

finish the navbar

https://support.google.com/sites/answer/97459?hl=en
google analytics


o sa fie un singur serviciu - remove (Services button from navbar)
langa servicu - formular: nume, prenume, institutie, nr telefon, email.



vezi toate produsele - click - pagina noua, display 3 main categorii (clickable)
