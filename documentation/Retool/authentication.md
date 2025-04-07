### Retool Admin Portal Authentication

#### Intro

The admin portal is developed in Retool. In order to use it, the following must be true:

- A user must be invited to join Neutral's Retool Organization at https://neutral.retool.com/settings/users.
- A user must have a `@neutral.us` email address.
- A user must have created an investor portal account in the `production` environment, and their `Role` must be set to `ADMIN` in postgres (easiest via supabase UI).

#### Authentication Logic

The Admin Portal uses a custom authentication flow that is set up [here](https://neutral.retool.com/resources/0272e4da-3968-44f9-b597-38c6b1f6b316).

It calls `https://investor-portal-clerk.vercel.app/api/admin/auth?csrfNonce={{csrfNonce}}` to show the google oAith screen, and, once logged in, to return an auth token to Retool. This token, which is set to expire in 24 hours, is then stored in Retool, and used for every API request to our nextjs app.

All admin portal API requests are written under `/api/admin`, and the clerk middleware does not check these routes for a token. Therefore, each admin API route is responsible for checking the Authorization token, and ensuring that the requesting user has a `Role` of `ADMIN`. You can use the `getAdminFromRequest()` at the beginning of the route's logic.
