### Table RLS

Supabase recommends to protect all data using row level security. This way, a user that is making a direct request from the UX to Supabase can only access documents that they are entitled to access, for example if doc.ownerid === userid.
When creating new tables, we turn on RLS, but we do not write an RLS policy. This means that technically nobody is allowed to read the data from the table.

Our application backend uses a secret key to communicate with Supabase directly. This means that RLS is not enforced when going through the backend. Thus, our API needs to be written in a way that ensures that users can only access the database items they are entitled to. Therefore, every route should be written in a way that makes sure that a user can only see deals of orgs that they are a member of, for example, or update their own user entry, but not that of somebody else.
