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