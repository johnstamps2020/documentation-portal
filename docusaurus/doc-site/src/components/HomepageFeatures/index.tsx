import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import InstallationCodeBlock from "../InstallationCodeBlock";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";

type FeatureItem = {
  title: string;
  CodeBlock: React.ReactNode;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Theme",
    CodeBlock: <InstallationCodeBlock />,
    description: (
      <>
        Ready for docs.guidewire.com! This is the official Guidewire theme for
        docs with the beautiful header and footer, search box, user avatar, and
        more.
      </>
    ),
    link: "docs/Themes/Classic/set-up-theme",
  },
  {
    title: "Plugin",
    CodeBlock: <InstallationCodeBlock forPlugin />,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
    link: "docs/Plugins/Redoc/set-up-plugin",
  },
];

function Feature({ title, CodeBlock, description, link }: FeatureItem) {
  return (
    <div className={clsx("col col--6")}>
      <div className="text--center padding-horiz--md">
        <h2>{title}</h2>
        <div className="text--center">{CodeBlock}</div>
        <p>{description}</p>
        <Link
          className="button button--primary button--lg"
          to={useBaseUrl(link)}
        >
          Details
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
