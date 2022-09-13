import React from 'react';
import { usePageConfig } from '../hooks/usePageConfig';
import PageItem from './PageItem';

export default function LandingPage() {
  const pagePath = window.location.pathname;
  const [pageConfig] = usePageConfig(pagePath);

  if (!pageConfig) {
    return <div style={{ minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <main class={pageConfig.class}>
      <div class="pageBody">
        <div class="pageControllers">
          {/* <%- include('parts/platform-toggle') %> */}
          <div class="pageHero">
            {/* <%- include('parts/breadcrumbs') %> */}
            <h1>{pageConfig.title}</h1>
          </div>
          {/* <%- include('parts/page-selector') %> */}
        </div>
        <div class="content">
          <div className="items">
            {pageConfig.items &&
              pageConfig.items.map((item, key) => (
                <PageItem key={key} {...item} />
              ))}
          </div>
          {/* <%- include('parts/sidebar') %> */}
        </div>
      </div>
    </main>
  );
}
