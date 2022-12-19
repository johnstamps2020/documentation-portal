import Stack from "@mui/material/Stack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "@mui/material/Link";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  path: string;
  id: string;
};

type BreadcrumbProps = {
  pagePath: string;
};

export default function Breadcrumbs(breadcrumbProps: BreadcrumbProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>();

  useEffect(() => {
    async function loadBreadcrumbs() {
      const response = await fetch(
        `/safeConfig/entity/page/breadcrumbs?path=${breadcrumbProps.pagePath}`
      );
      if (response.ok) {
        const jsonData = await response.json();
        if (jsonData.length > 0) {
          setBreadcrumbs(jsonData);
        } else {
          setBreadcrumbs(undefined);
        }
      }
    }

    loadBreadcrumbs().catch(console.error);
  }, [breadcrumbProps.pagePath]);

  return (
    <Stack direction="row" divider={<ChevronRightIcon />} spacing={1}>
      {breadcrumbs &&
        breadcrumbs.map(({ path, label, id }) => (
          <Link component={RouterLink} to={`/${path}`} key={id}>
            {label}
          </Link>
        ))}
      {!breadcrumbs && <div style={{ height: "34px" }}></div>}
    </Stack>
  );
}
