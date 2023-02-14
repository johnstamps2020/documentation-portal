import React from "react";
import { useDocContext } from "@theme/DocContext";
import ExternalUserCheckbox from "./ExternalUserCheckbox";
import InternalSiteCheckbox from "./InternalSiteCheckbox";
import EarlyAccessSiteCheckbox from "./EarlyAccessSiteCheckbox";
import PluginDataPreview from "./PluginDataPreview";

export default function DebugControls() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const { userInformation } = useDocContext();

  if (!isDevelopment || !userInformation) {
    return null;
  }

  return (
    <>
      <ExternalUserCheckbox />
      <InternalSiteCheckbox />
      <EarlyAccessSiteCheckbox />
      <PluginDataPreview />
    </>
  );
}
