# Investor Portal with Clerk Auth

This is an alternative approach that uses Clerk Auth

## Project Scope: 
* Investor can sign up/ sign in using 2FA or a magic link
* Admin can invite an investor to use the app
* Port all existing investors and deals from Hubspot into the portal
* Investor can see current opportunities
* Investor can see their deal flow for each project
* Investor can schedule a meeting
* Basic Chat functionality for help/ questions
* User can download project documents (PDFs) with hubspot tracking


## Stack
![alt text](image.png)
- [Next.js](https://nextjs.org)
- [Clerk](https://clerki.io/) for auth and user management
- [Prisma](https://prisma.io) as ORM
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Supabase](https://supabase.com/) to host our postgres DBs, and for file storage
- [MUI](https://mui.com/material-ui/)

## Learn More
To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials
- [Great Youtube Tutorial by T3 Theo](https://www.youtube.com/watch?v=YkOSUVzOAA4)

## How do I deploy this?
This app is automatically deployed to Vercel: https://vercel.com/the-neutral-project/investor-portal
Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), 

## Testing/ CI CD
TBD

## Getting started
Ask Jonatan for the .env file
`npm i`
`npm run dev`
`npx prisma migrate dev --name [description]` to run a schema mirgation
make sure to `npm run lint` before committing
