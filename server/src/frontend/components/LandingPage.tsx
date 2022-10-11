import React from 'react';
import { PageConfig } from '../../model/entity/PageConfig';
import PageItem from './PageItem';
import Breadcrumbs from './Breadcrumbs';
import Error from './Error';

export default function LandingPage() {
  const pageConfigText = document.getElementById('pageConfig')?.innerText;
  const deploymentEnv = document
    .getElementById('deploymentEnv')
    ?.innerText.trim();

  if (!pageConfigText) {
    return <Error message="Config not provided!" />;
  }

  if (!deploymentEnv) {
    return <Error message="Deployment env not provided!" />;
  }

  const pageConfig = JSON.parse(pageConfigText) as PageConfig;

  // don't forge tto delete me!
  console.log({ deploymentEnv, pageConfig });

  return (
    <main className={pageConfig.class}>
      <div className="pageBody">
        <div className="pageControllers">
          {/* <%- include('parts/platform-toggle') %> */}
          <div className="pageHero">
            <Breadcrumbs />
            <h1>{pageConfig.title}</h1>
          </div>
          {/* <%- include('parts/page-selector') %> */}
        </div>
        <div className="content">
          <div className="items">
            {pageConfig.items &&
              pageConfig.items.map((item, key) => (
                <PageItem {...item} key={key} deploymentEnv={deploymentEnv} />
              ))}
          </div>
          {/* <%- include('parts/sidebar') %> */}
        </div>
      </div>
    </main>
  );
}
