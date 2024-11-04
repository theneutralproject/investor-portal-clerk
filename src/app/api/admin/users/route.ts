import prisma from "@/libs/prisma";
import { getErrorMessage, jsonResponse } from "@/libs/utils";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

// test route to get user if correct jwt is provided
export async function GET(request: NextRequest) {
    // get jwt from request headers
    const token = request.headers.get("Authorization");
    if(token){
        console.log("token", token);
    }  
    if(!token){
        return jsonResponse("No token provided", 401);
    }
    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("decoded1", decoded);
    const {  email } = decoded as { id: number, email: string };
    if(!email){
        return jsonResponse(`decoded contains no email`, 401);
    }
    const currentUser = await prisma.user.findUnique({ where: { email } });
    return jsonResponse(currentUser);
    } catch (error) {
        console.error(error);
        return jsonResponse(getErrorMessage(error), 401);
    }


}
