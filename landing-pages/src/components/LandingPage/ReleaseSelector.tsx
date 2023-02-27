import { useReleasePageSelectorProps } from "../../pages/landing";
import LandingPageSelector from "./LandingPageSelector";

type ReleaseSelectorProps = {
  currentRelease: string;
};

export default function ReleaseSelector({
  currentRelease,
}: ReleaseSelectorProps) {
  const releaseSelectorProps = useReleasePageSelectorProps(currentRelease);
  return <LandingPageSelector {...releaseSelectorProps} />;
}
