import { redirect } from "next/navigation";

const GOOGLE_OAUTH_SCOPES = [
    "https%3A//www.googleapis.com/auth/userinfo.email",
    "https%3A//www.googleapis.com/auth/userinfo.profile",
];

export async function GET() {
    // TODO: include retool cbURL in state
    console.log("in get");
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/${process.env.GOOGLE_CALLBACK_URL_SUBDIRECTORY}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
}
