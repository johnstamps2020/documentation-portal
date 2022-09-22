import React, { useEffect, useState } from 'react';
import { PageItem } from '../../model/entity/PageItem';

export default function LabelOrLink({ label, id, link, page }: PageItem) {
  const [href, setHref] = useState<string|undefined>()
  async function getHref() {
    if (id) {
      let docPath = window.location.origin
      if (docPath.slice(-1) !== '/') {
        docPath = `${window.location.origin}/`
      }
      const response = await fetch(`${docPath}safeConfig/docUrl/${id}`)
      const data = await response.json()
      const url = data.url
      setHref(new URL(url, docPath).toString())
    }

    if (page) {
      let pagePath = window.location.href
      if (pagePath.slice(-1) !== '/') {
        pagePath = `${window.location.href}/`
      }
      setHref(new URL(page, pagePath).toString())
    }

    if (link) {
      setHref(link)
    }
  }

  useEffect(function () { 
    getHref()
   }, [])

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
