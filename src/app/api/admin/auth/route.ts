import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

const GOOGLE_OAUTH_SCOPES = [
    "https%3A//www.googleapis.com/auth/userinfo.email",
    "https%3A//www.googleapis.com/auth/userinfo.profile",
];

export async function GET(request: NextRequest) {
    // TODO: include retool cbURL in state
    console.log("in get");
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    const retoolNonce = queryParams.get("csrfNonce") ?? "";
    console.log("retoolNonce", retoolNonce);
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/${process.env.GOOGLE_CALLBACK_URL_SUBDIRECTORY}&access_type=offline&response_type=code&state=${retoolNonce}&scope=${scopes}`;
    redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
}
