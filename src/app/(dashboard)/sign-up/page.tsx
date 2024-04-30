import { SignUp } from "@clerk/nextjs";
import { Box } from "@mui/material";

export default function Page() {
  return <Box display="flex" alignItems="center" justifyContent="center" ><SignUp path="/sign-up" /></Box>;
}