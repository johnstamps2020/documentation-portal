import React, { useEffect, useState } from 'react';
import { Crumb } from '../../types/crumb';

export default function Breadcrumbs() {
  const [breadcrumb, setBreadcrumb] = useState<Crumb[] | undefined>();

  async function createBreadcrumbArray(crumbs: Array<Crumb>, path: string) {
    const newUrl = path.substring(0, path.lastIndexOf('/'));
    const rootPaths = ['/cloudProducts', '/apiReferences'];
    if (newUrl === '' || rootPaths.includes(newUrl)) {
      setBreadcrumb(crumbs);
    }
    const crumb = {
      label: '',
      path: '',
    };
    const response = await fetch(new URL(newUrl, window.location.origin));
    if (response.ok) {
      let urlLabelCamelCase = newUrl.split('/').reverse()[0];
      let urlLabel = '';
      let textResponse = await response.text();
      const labelRegex = textResponse.match('\\<h1\\>(.*)\\<\\/h1\\>');
      if (labelRegex && labelRegex?.length > 1) {
        urlLabel = labelRegex[1];
      } else {
        if (urlLabelCamelCase.length > 0) {
          urlLabel = urlLabelCamelCase
            .replace(/([A-Z])/g, ' $1')
            .replace(urlLabelCamelCase[0], urlLabelCamelCase[0].toUpperCase());
        }
      }
      crumb.label = urlLabel;
      crumb.path = newUrl;
      crumbs.unshift(crumb);
    }
    await createBreadcrumbArray(crumbs, newUrl);
    setBreadcrumb(crumbs);
  }
  let pagePath = window.location.pathname;
  useEffect(function() {
    createBreadcrumbArray([], pagePath);
  }, []);
  if (breadcrumb) {
    return (
      <div className="breadcrumbs">
        {breadcrumb.map((object: Crumb) => {
          return <a href={object.path}> {object.label} </a>;
        })}
      </div>
    );
  } else {
    return <div className="breadcrumbs"></div>;
  }
}
