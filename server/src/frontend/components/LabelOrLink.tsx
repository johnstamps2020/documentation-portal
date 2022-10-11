import React, { useEffect, useState } from 'react';
import { LandingPageItem } from '../../model/entity/LandingPageItem';

export type LabelOrLinkProps = {
  label: LandingPageItem['label'];
  id?: LandingPageItem['id'];
  link?: LandingPageItem['link'];
  page?: LandingPageItem['page'];
};

export default function LabelOrLink({
  label,
  id,
  link,
  page,
}: LabelOrLinkProps) {
  const [href, setHref] = useState<string | undefined>();

  async function getHref() {
    if (id) {
      let docPath = window.location.origin;
      if (docPath.slice(-1) !== '/') {
        docPath = `${window.location.origin}/`;
      }
      const response = await fetch(`/safeConfig/entity/DocConfig?id=${id}`);
      const data = await response.json();
      const url = data.url;
      setHref(new URL(url, docPath).toString());
    }

    if (page) {
      let pagePath = window.location.href;
      if (pagePath.slice(-1) !== '/') {
        pagePath = `${window.location.href}/`;
      }
      setHref(new URL(page, pagePath).toString());
    }

    if (link) {
      setHref(link);
    }
  }

  useEffect(function() {
    getHref().then(r => r);
  }, []);

  if (href) {
    return (
      <div>
        <a href={href}>{label}</a>
      </div>
    );
  }

  if (label) {
    return <div className="label">{label}</div>;
  }

  return null;
}
