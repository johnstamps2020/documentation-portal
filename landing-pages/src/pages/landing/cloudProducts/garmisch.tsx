import {
  baseBackgroundProps,
  LandingPageProps,
  useReleasePageSelectorProps
} from "..";
import CategoryLayout2, {
  CategoryLayout2Props
} from "../../../components/LandingPage/Category/CategoryLayout2";
import gradientBackgroundImage from "../../../images/background-gradient.svg";
import garmischBackgroundImage from "./background-garmisch.png";

const docs: CategoryLayout2Props["items"] = [
  {
    label: "Platform",
    items: [
      {
        label: "Cloud Home",
        docId: "gchhelprelease"
      },
      {
        label: "Cloud Platform",
        pagePath: "cloudProducts/cloudConsole"
      },
      {
        label: "Data Platform",
        docId: "dataplatform"
      },
      {
        label: "Cloud Data Access",
        pagePath: "cloudProducts/cloudDataAccess/latest"
      },
      {
        label: "Workflow Service (Early Access)",
        pagePath: "cloudProducts/workflowservice"
      }
    ]
  },
  {
    label: "Applications",
    items: [
      {
        label: "PolicyCenter",
        pagePath: "cloudProducts/garmisch/pcGwCloud/2023.02"
      },
      {
        label: "ClaimCenter",
        pagePath: "cloudProducts/garmisch/ccGwCloud/2023.02"
      },
      {
        label: "BillingCenter",
        pagePath: "cloudProducts/garmisch/bcGwCloud/2023.02"
      },
      {
        label: "InsuranceNow",
        pagePath: "cloudProducts/garmisch/insuranceNow/2023.1"
      },
      {
        label: "Digital Reference Applications",
        pagePath: "cloudProducts/garmisch/dx-ref-apps"
      },
      {
        label: "Global Content Reference Applications",
        pagePath: "cloudProducts/garmisch/global-ref-apps"
      }
    ]
  },
  {
    label: "Analytics",
    items: [
      {
        label: "DataHub",
        pagePath: "cloudProducts/garmisch/dhGwCloud/2023.02"
      },
      {
        label: "InfoCenter",
        pagePath: "cloudProducts/garmisch/icGwCloud/2023.02"
      },
      {
        label: "Explore",
        pagePath: "cloudProducts/explore/latest"
      },
      {
        label: "Canvas",
        docId: "canvas"
      },
      {
        label: "Compare",
        docId: "comparelatest"
      },
      {
        label: "HazardHub",
        url: "/hazardhub/HazardHub_Intro_gw.pdf"
      },
      {
        label: "Predict",
        docId: "livepredictlatest"
      },
      {
        label: "Cyence Cyber",
        pagePath: "cloudProducts/cyence"
      },
      {
        label: "Data Studio (Early Access)",
        docId: "datastudiorelease"
      }
    ]
  },
  {
    label: "Developer Resources",
    items: [
      {
        label: "Advanced Product Designer App",
        pagePath: "cloudProducts/garmisch/apd"
      },
      {
        label: "API References",
        pagePath: "apiReferences/garmisch"
      },
      {
        label: "Integration Gateway",
        docId: "integgatewaydevlatest"
      },
      {
        label: "App Events",
        docId: "appeventsdev"
      },
      {
        label: "REST API Client",
        docId: "isrestapiclientguide"
      },
      {
        label: "Guidewire Testing",
        pagePath: "testingFramework/garmisch"
      },
      {
        label: "Workset Manager",
        docId: "worksetmgr"
      }
    ]
  }
];

const other = {
  search_filters: {
    platform: ["Cloud"]
  }
};

export default function Garmisch({ title }: LandingPageProps) {
  const pageSelectorProps = useReleasePageSelectorProps(title);
  const backgroundImage = {
    xs: `url(${gradientBackgroundImage})`,
    sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
  url(${garmischBackgroundImage}), 
  linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`
  };

  return (
    <CategoryLayout2
      items={docs}
      backgroundProps={{ ...baseBackgroundProps, backgroundImage }}
      pageSelector={pageSelectorProps}
    />
  );
}
