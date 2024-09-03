import { createFileRoute } from '@tanstack/react-router';
import CategoryLayout, {
  CategoryLayoutProps,
} from 'components/LandingPage/Category/CategoryLayout';
import { baseBackgroundProps } from 'components/LandingPage/LandingPageTypes';

const pageConfig: CategoryLayoutProps = {
  backgroundProps: {
    ...baseBackgroundProps,
    backgroundColor: `hsl(0, 0%, 98%)`,
  },

  cards: [
    {
      label: 'AU',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobau10xcloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobaucwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobaustatereleasenotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobau10xonprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobaucwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobaustatereleasenotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'BOP',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobbopcloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobbopcwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobbopstatereleasenotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobboponprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobbopcwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobbopstatereleasenotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'CA',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobcacloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobcacwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobcastatereleasenotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobcaonprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobcacwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobcastatereleasenotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'CP',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobcpcloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobcpcwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobcpstatereleasenotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobcponprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobcpcwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobcpstatereleasenotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'CPP',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobcppcloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobcpponprem',
            },
          ],
        },
      ],
    },
    {
      label: 'Crime',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobcrimecloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobcrimecwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobcrimestatereleasenotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobcrimeonprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobcrimecwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobcrimestatereleasenotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'GL',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobgl9x1003cloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobglcwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobglstatereleasenotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobgl9x1003onprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobglcwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobglstatereleasenotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'HO',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobhocloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobhoonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'PCA',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobpcausercloud',
            },
            {
              label: 'Release Notes',
              docId: 'lobpcareleasenotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobpcauseronprem',
            },
            {
              label: 'Release Notes',
              docId: 'lobpcareleasenotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'PUP',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobpupcloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobpuponprem',
            },
          ],
        },
      ],
    },
    {
      label: 'WC',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobwccloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobwccwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobwcstaterelnotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobwconprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobwccwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobwcstaterelnotesonprem',
            },
          ],
        },
      ],
    },
    {
      label: 'WC WCM',
      sections: [
        {
          label: 'Cloud',
          items: [
            {
              label: 'Guide',
              docId: 'lobwcmcloud',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobwcwcmcwreleasenotescloud',
            },
            {
              label: 'State Release Notes',
              docId: 'lobwcwcmstaterelnotescloud',
            },
          ],
        },
        {
          label: 'Self-managed',
          items: [
            {
              label: 'Guide',
              docId: 'lobwcmonprem',
            },
            {
              label: 'CW Release Notes',
              docId: 'lobwcwcmcwreleasenotesonprem',
            },
            {
              label: 'State Release Notes',
              docId: 'lobwcwcmstaterelnotesonprem',
            },
          ],
        },
      ],
    },
  ],
};

export const Route = createFileRoute('/lobs')({
  component: Lobs,
});

function Lobs() {
  return <CategoryLayout {...pageConfig} />;
}
