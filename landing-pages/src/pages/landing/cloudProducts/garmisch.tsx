import {
  baseBackgroundProps,
  LandingPageProps,
  useReleasePageSelectorProps,
} from "..";
import CategoryLayout2 from "../../../components/LandingPage/Category/CategoryLayout2";
import gradientBackgroundImage from "../../../images/background-gradient.svg";
import garmischBackgroundImage from "./background-garmisch.png";

const docs = [
  {
    label: "Platform",
    class: "categoryCard cardShadow",
    items: [
      {
        label: "Cloud Home",
        id: "gchhelprelease",
      },
      {
        label: "Cloud Platform",
        page: "../cloudConsole",
      },
      {
        label: "Data Platform",
        id: "dataplatform",
      },
      {
        label: "Cloud Data Access",
        page: "../cloudDataAccess/latest",
      },
      {
        label: "Workflow Service (Early Access)",
        page: "../workflowservice",
      },
    ],
  },
  {
    label: "Applications",
    class: "categoryCard cardShadow",
    items: [
      {
        label: "PolicyCenter",
        page: "pcGwCloud/2023.02",
      },
      {
        label: "ClaimCenter",
        page: "ccGwCloud/2023.02",
      },
      {
        label: "BillingCenter",
        page: "bcGwCloud/2023.02",
      },
      {
        label: "InsuranceNow",
        page: "insuranceNow/2023.1",
      },
      {
        label: "Digital Reference Applications",
        page: "dx-ref-apps",
      },
      {
        label: "Global Content Reference Applications",
        page: "global-ref-apps",
      },
    ],
  },
  {
    label: "Analytics",
    class: "categoryCard cardShadow",
    items: [
      {
        label: "DataHub",
        page: "dhGwCloud/2023.02",
      },
      {
        label: "InfoCenter",
        page: "icGwCloud/2023.02",
      },
      {
        label: "Explore",
        page: "../explore/latest",
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
        label: "HazardHub",
        link: "/hazardhub/HazardHub_Intro_gw.pdf",
      },
      {
        label: "Predict",
        id: "livepredictlatest",
      },
      {
        label: "Cyence Cyber",
        page: "../cyence",
      },
      {
        label: "Data Studio (Early Access)",
        id: "datastudiorelease",
      },
    ],
  },
  {
    label: "Developer Resources",
    class: "categoryCard cardShadow",
    items: [
      {
        label: "Advanced Product Designer App",
        page: "apd",
      },
      {
        label: "API References",
        page: "../../apiReferences/garmisch",
      },
      {
        label: "Integration Gateway",
        id: "integgatewaydevlatest",
      },
      {
        label: "App Events",
        id: "appeventsdev",
      },
      {
        label: "REST API Client",
        id: "isrestapiclientguide",
      },
      {
        label: "Guidewire Testing",
        page: "../../testingFramework/garmisch",
      },
      {
        label: "Workset Manager",
        id: "worksetmgr",
      },
    ],
  },
];

const other = {
  selector: {
    label: "Select release",
    selectedItem: "Garmisch",
    items: [
      {
        label: "Flaine",
        page: "../flaine",
      },
      {
        label: "Elysian",
        page: "../elysian",
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
  search_filters: {
    platform: ["Cloud"],
  },
};

export default function Garmisch({ pageData }: LandingPageProps) {
  const pageSelectorProps = useReleasePageSelectorProps(pageData.title);
  const backgroundImage = {
    xs: `url(${gradientBackgroundImage})`,
    sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${garmischBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
  };

  return (
    <CategoryLayout2
      pageData={pageData}
      backgroundProps={{ ...baseBackgroundProps, backgroundImage }}
      pageSelector={pageSelectorProps}
    />
  );
}
