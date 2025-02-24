import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';
import prisma from '@/libs/prisma.server'; // Adjust this import based on your ORM setup

dotenv.config();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function updateUsersFromDatabase() {
  try {
    // Fetch all users from your database
    const dbUsers = await prisma.user.findMany({
      select: { id: true, clerkId: true }, // Get only relevant fields
    });

    console.log(`Found ${dbUsers.length} users in the database.`);

    for (const dbUser of dbUsers) {
      if (!dbUser.clerkId) {
        console.warn(`Skipping user ${dbUser.id} (No Clerk ID)`);
        continue;
      }

      try {
        await clerkClient.users.updateUser(dbUser.clerkId, {
          publicMetadata: {
            onboardingComplete: true,
            investorPortalId: dbUser.id,
          },
        });

        console.log(
          `Updated Clerk's metadata for user '${dbUser.clerkId}' with investorPortalId: ${dbUser.id} and onboardingComplete as true`
        );
      } catch (updateError) {
        console.error(
          `Error updating Clerk user ${dbUser.clerkId}:`,
          updateError
        );
      }
    }

    console.log(`Clerk users updated successfully.`);
  } catch (error) {
    console.error('Error fetching users from database:', error);
  }
}

// Run the function
updateUsersFromDatabase();
