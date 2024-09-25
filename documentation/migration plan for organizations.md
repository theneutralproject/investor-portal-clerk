# Migratiuon plan for organizations

### Background
To date, a deal belongs to a single user.
Going forward, a deal will always belong to an organization.
An organization will have one or more members.
A user will belong to one or more organizations.

### Rollout Sequence:
1. create new prisma schemas and migration files. **Do not yet delete the .userId field from the deal**
2. run a script that creates an organization for each user in the DB, captures its id, and attaches it to all of the deals for that user.

