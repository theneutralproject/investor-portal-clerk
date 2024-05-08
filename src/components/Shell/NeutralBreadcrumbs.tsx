import { Typography, Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { capitalize } from "lodash"; // Ensure lodash is installed or use a custom capitalize function
import React from "react";

const NeutralBreadcrumbs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter(Boolean);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <Typography
            key={to}
            color={last ? "text.primary" : "text.secondary"}
            sx={{ cursor: last ? "default" : "pointer", fontSize: "18px" }}
            onClick={() => !last && router.push(to)}
          >
            {capitalize(value)}
          </Typography>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default NeutralBreadcrumbs;
