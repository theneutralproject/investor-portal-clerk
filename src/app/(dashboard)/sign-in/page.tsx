import { SignIn } from "@clerk/nextjs";
import { Box } from "@mui/material";

export default function Page() {
  return <Box display="flex" alignItems="center" justifyContent="center" ><SignIn path="/sign-in" signUpUrl="sign-up" afterSignUpUrl="/" afterSignInUrl="/"/></Box>;
}