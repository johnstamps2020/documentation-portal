import { describe, expect, it } from 'vitest';
import {
  PageSelectorItem,
  sortPageSelectorItems,
} from './LandingPageSelectorInContext';

describe('LandingPageSelector', () => {
  describe('should sort versions correctly', () => {
    it('Banff is above Aspen', () => {
      const items: PageSelectorItem[] = [
        { label: 'Aspen', href: 'https://www.example.com/aspen', isDoc: false },
        { label: 'Banff', href: 'https://www.example.com/banff', isDoc: false },
      ];

      const sortedItems = sortPageSelectorItems(items);
      expect(sortedItems[0].label).toEqual('Banff');
    });

    it('Hakuba with a six-digit number is above Garmisch with a similar number', () => {
      const items: PageSelectorItem[] = [
        {
          label: 'Garmisch (2023.02)',
          href: 'https://www.example.com/garmisch',
          isDoc: false,
        },
        {
          label: 'Hakuba (2023.06)',
          href: 'https://www.example.com/hakuba',
          isDoc: false,
        },
      ];

      const sortedItems = sortPageSelectorItems(items);
      expect(sortedItems[0].label).toEqual('Hakuba (2023.06)');
    });

    it('Semver starting with 10 is above semver starting with 2', () => {
      const items: PageSelectorItem[] = [
        {
          label: '2.0.3',
          href: 'https://www.example.com/2.0.3',
          isDoc: false,
        },
        {
          label: '10.0.1',
          href: 'https://www.example.com/10.0.1',
          isDoc: false,
        },
      ];

      const sortedItems = sortPageSelectorItems(items);
      expect(sortedItems[0].label).toEqual('10.0.1');
    });
  });
});
