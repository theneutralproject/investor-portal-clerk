import { getAdminFromRequest, matchDealWithPdf } from "@/libs/admin/utils";
import { zPdfBulkUploadSchema } from "@/libs/document/schema";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import { isError } from "lodash";
import type { NextRequest } from "next/server";
import type { MatchResponseObject } from "@/libs/admin/schema";
import prisma from "@/libs/prisma.server";
import { storageClient } from "@/libs/supabase";
import { type DealWithFullOrgAndProject } from "@/libs/types";

/**
 * Admin can upload up to 20 PDFs at a time
 * @param request NextRequest containing FormData with PDF files
 * @returns JSON response with array of matched deals or error
 */
export async function POST(request: NextRequest) {
  try {
    // Validate admin user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const adminUser = await getAdminFromRequest(request);
    if (isError(adminUser)) {
      return jsonResponse(getErrorMessage(adminUser), 401);
    }

    // Fetch all deals with necessary relations
    const deals = (await prisma.deal.findMany({
      include: {
        organization: {
          include: {
            members: {
              include: {
                user: {
                  include: {
                    address: true,
                  },
                },
              },
            },
            address: true,
          },
        },
        project: true,
      },
    })) as DealWithFullOrgAndProject[];

    // Parse and validate form data
    const formData = await request.formData();
    const parsedData = zPdfBulkUploadSchema.parse(formData);
    const { files } = parsedData;

    // Clean up existing temporary storage
    const { data: existingFiles, error: listError } = await storageClient
      .from("deal-documents")
      .list("tempPdfStorage");

    if (listError) {
      console.error(
        "Error listing existing files:",
        getErrorMessage(listError)
      );
    } else if (existingFiles?.length) {
      const filePaths = existingFiles.map(
        (file) => `tempPdfStorage/${file.name}`
      );
      const { error: deleteError } = await storageClient
        .from("deal-documents")
        .remove(filePaths);

      if (deleteError) {
        console.error(
          "Error deleting existing files:",
          getErrorMessage(deleteError)
        );
        return jsonResponse(
          { error: "Failed to clean up temporary storage" },
          500
        );
      }
    }

    // Process each file
    const results: (MatchResponseObject | null)[] = [];

    for (const file of files) {
      // Ensure file is actually a File object
      if (!(file instanceof File)) {
        console.error("Invalid file object received");
        results.push(null);
        continue;
      }

      // Upload to temporary storage
      const { error: uploadError } = await storageClient
        .from("deal-documents")
        .upload(`tempPdfStorage/${file.name}`, file, {
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload error:", getErrorMessage(uploadError));
        results.push(null);
        continue;
      }

      // Match file with deal
      try {
        const match = await matchDealWithPdf(deals, file);
        if (isError(match)) {
          console.error("Matching error:", getErrorMessage(match));
          results.push(null);
        } else {
          results.push(match);
        }
      } catch (matchError) {
        console.error("Matching error:", getErrorMessage(matchError));
        results.push(null);
      }
    }

    return jsonResponse(results);
  } catch (error) {
    console.error("Route error:", getErrorMessage(error));
    return jsonResponse({ error: getErrorMessage(error) }, 500);
  }
}
