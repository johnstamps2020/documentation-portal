import { useLayoutContext } from 'LayoutContext';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';
import { LandingPageSelectorInContextProps } from '../LandingPageSelectorInContext';
import { ApplicationLayoutProps } from './ApplicationLayout';
import { useEffect } from 'react';

type ApplicationSelectorSetterProps = {
  selector: ApplicationLayoutProps['selector'];
};

export default function ApplicationSelectorSetter({
  selector,
}: ApplicationSelectorSetterProps) {
  const { allAvailableItems } = useLandingPageItemsContext();
  const { setSelector } = useLayoutContext();

  useEffect(() => {
    if (allAvailableItems && selector) {
      const selectorPropsInContext: LandingPageSelectorInContextProps = {
        ...selector,
        predefinedAvailableItems: allAvailableItems,
      };
      setSelector(selectorPropsInContext);
    }
  }, [allAvailableItems, selector, setSelector]);

  return null;
}
