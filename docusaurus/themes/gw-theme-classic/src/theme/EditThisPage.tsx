import React from "react";
import InitialEditThisPage from "@theme-init/EditThisPage";
import Internal from "@theme/Internal";

export default function EditThisPage(props) {
  return (
    <Internal hidePrompt>
      <InitialEditThisPage {...props} />
    </Internal>
  );
}
