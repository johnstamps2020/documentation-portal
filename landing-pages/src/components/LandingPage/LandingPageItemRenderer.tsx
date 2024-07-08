import { LandingPageItemData } from 'hooks/hookTypes';
import { PageError } from 'hooks/usePageData';

export type LandingPageItemRendererProps = {
  skeleton: React.ReactNode;
  item: React.ReactNode;
  landingPageItems: LandingPageItemData[] | undefined;
  isLoading: boolean;
  isError: PageError | undefined;
  landingPageSectionsItems?: LandingPageItemData[] | undefined;
  isLoadingSections?: boolean;
  isErrorSections?: PageError | undefined;
};

export default function LandingPageItemRenderer({
  skeleton,
  item,
  landingPageItems,
  isLoading,
  isError,
  landingPageSectionsItems = undefined,
  isErrorSections = undefined,
  isLoadingSections = false,
}: LandingPageItemRendererProps) {
  if (
    (!landingPageSectionsItems && !landingPageItems) ||
    ((landingPageSectionsItems?.length === 0 || !landingPageSectionsItems) &&
      (landingPageItems?.length === 0 || !landingPageItems) &&
      !isLoading &&
      !isLoadingSections) ||
    isErrorSections ||
    isError
  ) {
    return null;
  }

  if (isLoading || isLoadingSections) {
    return <>{skeleton}</>;
  }

  return <>{item}</>;
}
