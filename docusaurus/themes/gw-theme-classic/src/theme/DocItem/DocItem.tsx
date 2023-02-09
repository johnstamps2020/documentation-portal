import React from "react";
import InitialDocItem from "@theme-init/DocItem";
import EarlyAccess from "@theme/EarlyAccess";
import Internal from "@theme/Internal";

export default function DocItem(props) {
  const { internal } = props.content.frontMatter;

  function CustomizedDocItem() {
    return (
      <>
        <EarlyAccess />
        <InitialDocItem {...props} />
      </>
    );
  }

  if (internal) {
    return (
      <Internal showInfo>
        <CustomizedDocItem />
      </Internal>
    );
  }

  return <CustomizedDocItem />;
}
