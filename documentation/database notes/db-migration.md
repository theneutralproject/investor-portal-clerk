1. Edit your prisma schema

2. prisma migrate dev --name init

3. npx prisma migrate deploy

4. npx prisma generate

When running into "Drift detected":
create a shadow db in supabase or locally and follow these instructions to create and apply the required migration:
https://github.com/prisma/prisma/discussions/16141#discussioncomment-4094690
