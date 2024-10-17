### API Relationships and Behaviors explained

- Users have one or more organizations
- Organizations can have 0 or more deals
- Organizations have one (owner) or more (co-investors or CPA) members
- Members that are not the owner of an organization cannot edit the organization, nor can they edit the deals of that organization
- Members that are not the owner of an organization can only see deals for that org, once the deals have been completed
- When an org owner creates a member, and this member does not yet have their own user account, they subsequently do not yet have a clerkId. We consider them a "ghost member"
- When an org owner deletes a member that is a ghost member, their user entry and their user's org entry will also be deleted.
- When an org owner deletes a member that is a registrered user, their user (and org and address) entries do not get deleted. 