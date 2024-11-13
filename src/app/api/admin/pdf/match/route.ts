import { getAdminFromRequest, matchDealWithPdf } from "@/libs/admin/utils";
import { isFile, zPdfBulkUploadSchema } from "@/libs/document/schema";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import type { MatchResponseObject } from "@/libs/admin/schema";
import prisma from "@/libs/prisma.server";
import { storageClient } from "@/libs/supabase";

/**
 * Admin API endpoint for bulk PDF upload.
 * Allows admins to upload up to 20 PDFs at a time and matches them with deals.
 * Files are temporarily stored in 'tempPdfStorage' before processing.
 *
 * @param request NextRequest containing FormData with PDF files
 * @returns JSON response with array of matching results or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Validate admin authentication
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
      console.error("Authentication error:", getErrorMessage(adminUser));
      return jsonResponse({ error: "Unauthorized access" }, 401);
    }

    // Fetch all deals with related data for matching
    const deals = await prisma.deal.findMany({
      include: {
        organization: {
          include: {
            members: {
              include: {
                user: {
                  include: { address: true },
                },
              },
            },
            address: true,
          },
        },
        project: true,
      },
    });

    // Parse and validate form data
    const formData = await request.formData();
    const { files } = zPdfBulkUploadSchema.parse(formData);

    // Clean up existing temporary storage
    const { data: existingFiles, error: listError } = await storageClient
      .from("deal-documents")
      .list("tempPdfStorage");

    if (isError(listError)) {
      console.error(
        "Error listing temporary storage:",
        getErrorMessage(listError)
      );
      return jsonResponse({ error: "Failed to access storage" }, 500);
    }

    // Delete existing temporary files if any exist
    if (existingFiles?.length) {
      console.log(
        "Clearing temporary storage:",
        existingFiles.map((file) => file.name)
      );
      const { error: deleteError } = await storageClient
        .from("deal-documents")
        .remove(existingFiles.map((file) => `tempPdfStorage/${file.name}`));

      if (deleteError) {
        console.error(
          "Failed to clear temporary storage:",
          getErrorMessage(deleteError)
        );
        return jsonResponse({ error: "Failed to prepare storage" }, 500);
      }
    }

    // Process each file
    const matchResults: (MatchResponseObject | null)[] = [];

    for (const file of files) {
      if (!isFile(file)) {
        console.error("Invalid file object received");
        matchResults.push(null);
        continue;
      }

      const fileName = file.name;

      // Upload to temporary storage
      const { error: uploadError } = await storageClient
        .from("deal-documents")
        .upload(`tempPdfStorage/${fileName}`, file, {
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload failed for file:", fileName, uploadError);
        matchResults.push(null);
        continue;
      }

      console.log("Processing file:", fileName);

      // Match file with deal
      try {
        const match = await matchDealWithPdf(deals, file);
        matchResults.push(isError(match) ? null : match);
      } catch (matchError) {
        console.error("Matching failed for file:", fileName, matchError);
        matchResults.push(null);
      }
    }

    return jsonResponse(matchResults);
  } catch (error) {
    console.error("Bulk upload failed:", error);
    return jsonResponse(
      {
        error: getErrorMessage(error),
        message: "Failed to process PDF uploads",
      },
      500
    );
  }
}
