import { useEffect, useState } from 'react';
import LandingPageSelector, {
  LandingPageSelectorProps,
} from './LandingPageSelector';
import { usePageData } from 'hooks/usePageData';
import { useReleases } from 'hooks/useReleases';

function useReleasePageSelectorProps(): LandingPageSelectorProps {
  const { pageData } = usePageData();
  const [releaseSelectorProps, setReleaseSelectorProps] =
    useState<LandingPageSelectorProps>({
      label: 'Select release',
      selectedItemLabel: '',
      labelColor: 'white',
      items: [],
    });
  const releases = useReleases();

  useEffect(() => {
    if (pageData && releases.length > 0) {
      const matchingRelease = releases.find((r) =>
        pageData?.path.toLowerCase().includes(r.toLowerCase())
      );
      setReleaseSelectorProps((currentProps) => ({
        ...currentProps,
        selectedItemLabel: matchingRelease || '',
      }));
    }
  }, [pageData, releases]);

  useEffect(() => {
    if (releases.length > 0) {
      setReleaseSelectorProps((currentProps) => {
        return {
          ...currentProps,
          items: releases.map((label) => ({
            label,
            pagePath: `cloudProducts/${label.toLowerCase()}`,
          })),
        };
      });
    }
  }, [releases]);

  return releaseSelectorProps;
}

export default function ReleaseSelector() {
  const releaseSelectorProps = useReleasePageSelectorProps();
  return <LandingPageSelector {...releaseSelectorProps} />;
}
