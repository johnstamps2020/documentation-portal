import { useEffect, useState } from "react";
import { Page } from "server/dist/model/entity/Page";
import { LandingPageSelectorProps } from "../../components/LandingPage/LandingPageSelector";
import { useReleases } from "../../hooks/useReleases";

export type LandingPageProps = {
  pageData: Page;
};

export const baseBackgroundProps = {
  backgroundAttachment: "fixed",
  backgroundPosition: "bottom-right",
  backgroundSize: "cover",
  minHeight: "100vh",
};

export function useReleasePageSelectorProps(
  releaseLabel: string
): LandingPageSelectorProps {
  const [releaseSelectorProps, setReleaseSelectorProps] = useState<
    LandingPageSelectorProps
  >({
    label: "Select release",
    selectedItemLabel: releaseLabel,
    labelColor: "white",
    items: [],
  });
  const releases = useReleases();

  useEffect(() => {
    if (releases.length > 0) {
      setReleaseSelectorProps((currentProps) => {
        return {
          ...currentProps,
          items: releases.map((label) => ({
            label,
            href: `/landing/cloudProducts/${label.toLowerCase()}`,
          })),
        };
      });
    }
  }, [releases]);

  return releaseSelectorProps;
}
