import React, { useEffect } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import "@fontsource/source-sans-pro";
import "./GwRedoc.css";

export default function GwRedoc({ specRelativeUrl }) {
  const gwJs = useBaseUrl("/generated/gw.redoc.standalone.js");

  useEffect(() => {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src = gwJs;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    return () => {
      script.parentNode.removeChild(script);
      location.reload();
    };
  }, []);

  return (
    <div id="guidewire-redoc">
      <redoc
        is="div"
        spec-url={useBaseUrl(specRelativeUrl)}
        hide-schema-titles="false"
        hide-download-button="true"
        show-extensions="true"
        no-auto-auth="true"
        required-props-first="true"
        path-in-middle-panel="true"
        disable-search="true"
        hide-hostname="true"
        scroll-y-offset="120"
      ></redoc>
    </div>
  );
}
