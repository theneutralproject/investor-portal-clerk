'use server';
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma, { type DealWithOrgMembersAndProject } from "../prisma";
import { MembershipType, Role } from "@prisma/client";

// eslint-disable-next-line
const PdfParse = require("pdf-parse");
/**
 * 
 * @param request 
 * @returns an admin user if the jwt is valid
 */
export async function getAdminFromrequest(request: NextRequest) {
    // get jwt from request headers
    const token = request.headers.get("Authorization");
    if (token) {
        console.log("token", token);
    }
    if (!token) {
        throw new Error("No token provided");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const { email } = decoded as { id: number, email: string };
        if (!email) {
            throw new Error("No email found in token");
        }
        const adminUser = await prisma.user.findUnique({ where: { email, role: Role.ADMIN } });
        if (!adminUser) {
            throw new Error("Admin user not found");
        }
        return adminUser;
    } catch (error) {
        throw new Error("Invalid token");
    }
}


export async function matchDealWithPdf(deals: DealWithOrgMembersAndProject[], file: File) {
    // match the file to the correct deal
    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    // eslint-disable-next-line
    const { text } = (await PdfParse(dataBuffer)) as { text: string | null };
    if(!text) {
        return new Error("No text found in pdf");
    }
    let i = 0;
    let dealFound = false;
    let matchingDeal: DealWithOrgMembersAndProject | null = null;
    while (!dealFound && i < deals.length) {
        const deal = deals[i];
        if (!deal) {
            i++;
            continue;
        }

        const { organization, transactionId, project: { name: projectName } } = deal;
        const orgMembers = organization.members;
        const owner = orgMembers.find((member) => member.type === MembershipType.OWNER);
        if (!owner) {
            i++;
            continue;
        }
        const { firstName, lastName, ssn } = owner.user;
        const wordsToMatch = [firstName, lastName, projectName, (ssn && ssn?.length > 4) ? ssn.slice(-4) : ""].map((w) => w?.toLowerCase() ?? "");
        const matchFound = wordsToMatch.every(word => text.toLowerCase().includes(word));
        if (matchFound) {
            dealFound = true;
            matchingDeal = deal;
            console.log(`found a match for ${transactionId}`);
            console.log(`\t-->words to match: ${wordsToMatch.toString()}\n`);
          }
    }
    return matchingDeal;
}