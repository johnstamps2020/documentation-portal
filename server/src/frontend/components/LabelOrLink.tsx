import React, { useEffect, useState } from 'react';
import { PageItem } from '../../model/entity/PageItem';

export type LabelOrLinkProps = {
  label: PageItem['label'];
  id?: PageItem['id'];
  link?: PageItem['link'];
  page?: PageItem['page'];
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
      const response = await fetch(`/safeConfig/docUrl/${id}`);
      const data = await response.json();
      setHref(data.url);
    }

    if (page) {
      setHref(page);
    }

    if (link) {
      setHref(link);
    }
  }

  useEffect(function() {
    getHref();
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
