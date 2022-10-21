export const mockConfig = {
  id: "marco",
  title: "Elysian",
  template: "page",
  pagePath: "cloudProducts/elysian",
  breadcrumbs: [
    {
      id: "pint",
      label: "Cloud",
      link: "#",
    },
    {
      id: "lager",
      label: "Releases",
      link: "#",
    },
  ],
  class: "blue-theme elysian threeCards",
  selector: {
    label: "Select release",
    selectedItem: "Elysian",
    items: [
      {
        id: "strict",
        label: "Flaine",
        page: "../flaine",
      },
      {
        id: "adherence",
        label: "Dobson",
        page: "../dobson",
      },
      {
        id: "to",
        label: "Cortina",
        page: "../cortina",
      },
      {
        id: "a-diet",
        label: "Banff",
        page: "../banff",
      },
      {
        id: "may",
        label: "Aspen",
        page: "../aspen",
      },
    ],
  },
  items: [
    {
      id: "cause",
      label: "Applications",
      class: "categoryCard cardShadow",
      items: [
        {
          id: "premature",
          label: "PolicyCenter",
          page: "pcGwCloud/2022.05",
        },
        {
          id: "aging",
          label: "ClaimCenter",
          page: "ccGwCloud/2022.05",
        },
        {
          id: "and-loss",
          label: "BillingCenter",
          page: "bcGwCloud/2022.05",
        },
        {
          id: "of-a-sense",
          label: "InsuranceNow",
          page: "insuranceNow/2022.1",
        },
        {
          id: "of-purpose",
          label: "Guidewire for Salesforce",
          page: "gwsf",
        },
      ],
    },
    {
      id: "please",
      label: "Data and Analytics",
      class: "categoryCard cardShadow",
      items: [
        {
          id: "be-advised",
          label: "Cloud Data Access",
          page: "../cloudDataAccess/latest",
        },
        {
          label: "Data Platform",
          id: "dataplatform",
        },
        {
          id: "are-not-that-special",
          label: "DataHub",
          page: "dhGwCloud/2022.05",
        },
        {
          id: "and-take",
          label: "InfoCenter",
          page: "icGwCloud/2022.05",
        },
        {
          label: "Canvas",
          id: "canvas",
        },
        {
          label: "Compare",
          id: "comparelatest",
        },
        {
          id: "upturned",
          label: "Explore",
          page: "../explore/latest",
        },
        {
          id: "buckets",
          label: "HazardHub Casualty",
          page: "../hazardhubcasualty",
        },
        {
          id: "or-you-may",
          label: "HazardHub Property",
          link: "/hazardhub/property/Intro/HazardHub_Property_Intro_gw.pdf",
        },
        {
          label: "Predict",
          id: "livepredictlatest",
        },
      ],
    },
    {
      id: "to-look-up",
      label: "Digital",
      class: "categoryCard cardShadow",
      items: [
        {
          id: "and-you-could-unfortunately",
          label: "Digital Applications",
          class: "group",
          items: [
            {
              id: "glance",
              label: "CustomerEngage Account Management",
              page: "ceAccountMgmt/2022.05",
            },
            {
              id: "upon",
              label: "CustomerEngage Account Management for ClaimCenter",
              page: "ceAccountMgmtCc/2022.05",
            },
            {
              id: "the-moon",
              label: "CustomerEngage Quote and Buy",
              page: "ceQuoteAndBuy/2022.05",
            },
            {
              id: "that-shepherd",
              label: "ProducerEngage",
              page: "producerEngage/2022.05",
            },
            {
              id: "of-woe",
              label: "ProducerEngage for ClaimCenter",
              page: "producerEngageCc/2022.05",
            },
            {
              id: "though-silvery",
              label: "ServiceRepEngage",
              page: "serviceRepEngage/2022.05",
            },
            {
              id: "and-pretty",
              label: "VendorEngage",
              page: "vendorEngage/2022.05",
            },
          ],
        },
        {
          id: "as-a-mirror",
          label: "Jutro Design System 7.4.3",
          class: "group",
          items: [
            {
              label: "Jutro Design System and UI Framework",
              id: "jutro743",
            },
            {
              label: "Jutro Storybook",
              id: "storybook743",
            },
          ],
        },
        {
          id: "reflect",
          label: "Best Practices",
          class: "group",
          items: [
            {
              label: "Digital Best Practices",
              id: "dxpractices",
            },
          ],
        },
      ],
    },
    {
      id: "hate-reflecting",
      label: "Cyence",
      class: "categoryCard cardShadow",
      items: [
        {
          id: "it-makes",
          label: "Cyence Cyber",
          class: "group",
          items: [
            {
              id: "me-have-to-think",
              label: "Help Center",
              link: "/cyence/cyber/HelpCenter",
            },
            {
              id: "of-the-implications",
              label: "Help Center - Accumulation Only",
              link: "/cyence/cyber/HelpCenterAccum",
            },
            {
              id: "and-I-cannot-face-them",
              label: "Model 5 Technical Reference",
              link: "/cyence/cyber/Model5/CyenceCyberRiskModel5.pdf",
            },
            {
              id: "right-now",
              label: "Python SDK and REST API Reference",
              link: "/cyence/cyber/SdkApiRef",
            },
          ],
        },
        {
          id: "please-understand",
          label: "Cyence Cyber for Small/Medium Business",
          class: "group",
          items: [
            {
              id: "i-hope",
              label: "C#/Python SDKs and REST API Reference",
              link: "/cyence/smb/SdkApiRef",
            },
          ],
        },
      ],
    },
    {
      id: "you-can-give-me",
      label: "Guidewire Cloud Platform",
      class: "categoryCard cardShadow",
      items: [
        {
          id: "the-courtesy",
          label: "Cloud Home",
          class: "group",
          items: [
            {
              label: "Release Notes",
              id: "gchhelprnrelease",
            },
            {
              label: "Getting Started with Cloud Home",
              id: "gchhelprelease",
            },
            {
              label: "Cloud Updates",
              id: "updatedev",
            },
          ],
        },
        {
          id: "like-I-did",
          label: "Cloud Console",
          class: "group",
          items: [
            {
              label: "Release Notes",
              id: "guidewirecloudconsolerninsurerdev",
            },
            {
              label: "Release Notes",
              id: "guidewirecloudconsolerninsurerdevdraft",
            },
            {
              id: "but-I-need-time",
              label: "Cloud Console Documentation",
              page: "../cloudConsole",
            },
          ],
        },
        {
          id: "and-I-need-to-grow",
          label: "Cloud Infrastructure",
          class: "group",
          items: [
            {
              label: "Release Notes",
              id: "gwcpreleasenotes",
            },
            {
              label: "Authentication",
              id: "guidewireidentityfederationhubdraft",
            },
            {
              label: "Authentication",
              id: "guidewireidentityfederationhub",
            },
            {
              label: "Network Connectivity",
              id: "cloudplatformdraft",
            },
            {
              label: "Network Connectivity",
              id: "cloudplatformrelease",
            },
          ],
        },
        {
          label: "Cloud Updates",
          id: "updatedev",
        },
        {
          id: "of-rats",
          label: "Integration Framework",
          class: "group",
          items: [
            {
              label: "Release Notes",
              id: "integgatewayrnlatest",
            },
            {
              label: "Integration Gateway Developer Guide",
              id: "integgatewaydevlatest",
            },
          ],
        },
      ],
    },
    {
      id: "some-real-sound-advice",
      label: "Global Solutions",
      class: "categoryCard cardShadow",
      env: ["int"],
      items: [
        {
          id: "to-anyone-who-will-listen",
          label: "Australia",
          page: "../../globalSolutions/ipa/latest",
        },
      ],
    },
  ],
  search_filters: {
    platform: ["Cloud"],
  },
};
