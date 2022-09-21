import React from 'react';
import { useEnv } from '../hooks/useEnv';
import { usePageConfig } from '../hooks/usePageConfig';
import PageItem from './PageItem';

export default function LandingPage() {
  const pagePath = window.location.pathname;
  const [pageConfig] = usePageConfig(pagePath);
  const [deploymentEnv] = useEnv();

  if (!pageConfig || !deploymentEnv) {
    return <div style={{ minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <main className={pageConfig.class}>
      <div className="pageBody">
        <div className="pageControllers">
          {/* <%- include('parts/platform-toggle') %> */}
          <div className="pageHero">
            {/* <%- include('parts/breadcrumbs') %> */}
            <h1>{pageConfig.title}</h1>
          </div>
          {/* <%- include('parts/page-selector') %> */}
        </div>
        <div className="content">
          <div className="items">
            {pageConfig.items &&
              pageConfig.items.map((item, key) => (
                <PageItem key={key} {...item} deploymentEnv={deploymentEnv} />
              ))}
          </div>
          {/* <%- include('parts/sidebar') %> */}
        </div>
      </div>
    </main>
  );
}
