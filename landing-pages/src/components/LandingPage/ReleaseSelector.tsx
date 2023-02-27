import { useReleasePageSelectorProps } from "../../pages/landing";
import LandingPageSelector from "./LandingPageSelector";

export default function ReleaseSelector() {
  const releaseSelectorProps = useReleasePageSelectorProps();
  return <LandingPageSelector {...releaseSelectorProps} />;
}
