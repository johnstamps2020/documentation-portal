export const mockConfig = {
  title: "Elysian",
  template: "page",
  pagePath: "cloudProducts/elysian",
  class: "blue-theme elysian threeCards",
  selector: {
    label: "Select release",
    selectedItem: "Elysian",
    items: [
      {
        label: "Flaine",
        page: "../flaine",
      },
      {
        label: "Dobson",
        page: "../dobson",
      },
      {
        label: "Cortina",
        page: "../cortina",
      },
      {
        label: "Banff",
        page: "../banff",
      },
      {
        label: "Aspen",
        page: "../aspen",
      },
    ],
  },
  items: [
    {
      label: "Applications",
      class: "categoryCard cardShadow",
      items: [
        {
          label: "PolicyCenter",
          page: "pcGwCloud/2022.05",
        },
        {
          label: "ClaimCenter",
          page: "ccGwCloud/2022.05",
        },
        {
          label: "BillingCenter",
          page: "bcGwCloud/2022.05",
        },
        {
          label: "InsuranceNow",
          page: "insuranceNow/2022.1",
        },
        {
          label: "Guidewire for Salesforce",
          page: "gwsf",
        },
      ],
    },
    {
      label: "Data and Analytics",
      class: "categoryCard cardShadow",
      items: [
        {
          label: "Cloud Data Access",
          page: "../cloudDataAccess/latest",
        },
        {
          label: "Data Platform",
          id: "dataplatform",
        },
        {
          label: "DataHub",
          page: "dhGwCloud/2022.05",
        },
        {
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
          label: "Explore",
          page: "../explore/latest",
        },
        {
          label: "HazardHub Casualty",
          page: "../hazardhubcasualty",
        },
        {
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
      label: "Digital",
      class: "categoryCard cardShadow",
      items: [
        {
          label: "Digital Applications",
          class: "group",
          items: [
            {
              label: "CustomerEngage Account Management",
              page: "ceAccountMgmt/2022.05",
            },
            {
              label: "CustomerEngage Account Management for ClaimCenter",
              page: "ceAccountMgmtCc/2022.05",
            },
            {
              label: "CustomerEngage Quote and Buy",
              page: "ceQuoteAndBuy/2022.05",
            },
            {
              label: "ProducerEngage",
              page: "producerEngage/2022.05",
            },
            {
              label: "ProducerEngage for ClaimCenter",
              page: "producerEngageCc/2022.05",
            },
            {
              label: "ServiceRepEngage",
              page: "serviceRepEngage/2022.05",
            },
            {
              label: "VendorEngage",
              page: "vendorEngage/2022.05",
            },
          ],
        },
        {
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
      label: "Cyence",
      class: "categoryCard cardShadow",
      items: [
        {
          label: "Cyence Cyber",
          class: "group",
          items: [
            {
              label: "Help Center",
              link: "/cyence/cyber/HelpCenter",
            },
            {
              label: "Help Center - Accumulation Only",
              link: "/cyence/cyber/HelpCenterAccum",
            },
            {
              label: "Model 5 Technical Reference",
              link: "/cyence/cyber/Model5/CyenceCyberRiskModel5.pdf",
            },
            {
              label: "Python SDK and REST API Reference",
              link: "/cyence/cyber/SdkApiRef",
            },
          ],
        },
        {
          label: "Cyence Cyber for Small/Medium Business",
          class: "group",
          items: [
            {
              label: "C#/Python SDKs and REST API Reference",
              link: "/cyence/smb/SdkApiRef",
            },
          ],
        },
      ],
    },
    {
      label: "Guidewire Cloud Platform",
      class: "categoryCard cardShadow",
      items: [
        {
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
              label: "Cloud Console Documentation",
              page: "../cloudConsole",
            },
          ],
        },
        {
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
      label: "Global Solutions",
      class: "categoryCard cardShadow",
      env: ["int"],
      items: [
        {
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