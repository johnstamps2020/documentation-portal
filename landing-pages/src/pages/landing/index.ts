import { useEffect, useState } from 'react';
import { Page } from 'server/dist/model/entity/Page';
import { LandingPageSelectorProps } from '../../components/LandingPage/LandingPageSelector';
import { usePageData } from '../../hooks/usePageData';
import { useReleases } from '../../hooks/useReleases';

export type LandingPageProps = {
  title: string;
};

export const baseBackgroundProps = {
  backgroundAttachment: 'fixed',
  backgroundPosition: 'bottom-right',
  backgroundSize: 'cover',
  minHeight: '100vh',
};

export function useReleasePageSelectorProps(): LandingPageSelectorProps {
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
    if (pageData) {
      setReleaseSelectorProps((currentProps) => ({
        ...currentProps,
        selectedItemLabel: pageData.title,
      }));
    }
  }, [pageData]);

  useEffect(() => {
    if (releases.length > 0) {
      setReleaseSelectorProps((currentProps) => {
        return {
          ...currentProps,
          items: releases.map((label) => ({
            label,
            href: `/cloudProducts/${label.toLowerCase()}`,
          })),
        };
      });
    }
  }, [releases]);

  return releaseSelectorProps;
}
