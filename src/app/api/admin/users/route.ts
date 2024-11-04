import prisma from "@/libs/prisma";
import type { SessionData } from "@/libs/session/utils";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

// test route to get user if correct jwt is provided
export async function GET(request: NextRequest) {
    // get jwt from request headers
    const token = request.headers.get("authorization");
    if(!token){
        return jsonResponse("No token provided", 401);
    }
    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const {  userId, userEmail } = decoded as SessionData;
    console.log("decoded", userId, userEmail);
    const currentUser = await prisma.user.findUnique({ where: { email: userEmail } });
    return jsonResponse(currentUser);
    } catch (error) {
        console.error(error);
        return jsonResponse(getErrorMessage(error), 401);
    }


}
