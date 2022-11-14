import Stack from "@mui/material/Stack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { landingPageTheme } from "../../themes/landingPageTheme";

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
          <Link
            to={path}
            key={id}
            style={landingPageTheme.components?.MuiLink?.defaultProps?.style}
          >
            {label}
          </Link>
        ))}
    </Stack>
  );
}
