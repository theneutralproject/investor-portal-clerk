// import prisma from "@/libs/prisma";
// import { currentUser } from "@clerk/nextjs/server";
// import { type NextRequest } from "next/server";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// /**
//  * 
//  * @param request 
//  * @returns {Deal} deal for a given project
//  */
// export async function GET(request: NextRequest) {
//     const url = new URL(request.url);
//     const slug = new URLSearchParams(url.search).get("slug");
  
//     if (!slug) {
//       return jsonResponse({ error: "Project slug is required" }, 400);
//     }
  
//     try {
//       const user = await currentUser();
//       if (!user) {
//         return jsonResponse({ error: "User not found" }, 404);
//       }
  
//       const neutralUser = await prisma.user.findUnique({
//         where: { clerkId: user.id },
//       });
//       if (!neutralUser) {
//         console.error("Neutral user not found in api/deals");
//         return jsonResponse(
//           {
//             error: `User record with clerkid ${user.id} not found in prisma (GET)`,
//           },
//           404
//         );
//       }
  
//       // Find the project based on the slug
//       const project = await prisma.project.findUnique({
//         where: { slug: slug },
//       });
  
//       if (!project) {
//         return jsonResponse(
//           { error: `Project with slug ${slug} not found` },
//           404
//         );
//       }
  
//       const deals = await prisma.deal.findMany({
//         where: { organization: { in: []}, projectId: project.id },
//       });
  
//       if (!deals) {
//         return jsonResponse(null, 200); // Valid return with no deals found
//       }
  
//       return jsonResponse(deals);
//     } catch (error) {
//       const errorMessage = (error as Error).message;
//       console.error(errorMessage);
//       return jsonResponse({ error: "Error fetching data: " + errorMessage }, 500);
//     }
//   }