import React from 'react';
import LabelOrLink from './LabelOrLink';
import type { Item } from '../../../types/page';
import { Environment } from '../../../types/config';

type ItemProps = Item & {
  deploymentEnv: Environment;
}

export default function PageItem({ label, class: className, env, id, items, link, page, deploymentEnv }: ItemProps) {

  if (env && !env.includes(deploymentEnv)) {
    console.log('Filtering out', label, 'because', {env, deploymentEnv});
    return null;
  }
  //                 const itemHref = item.page ? encodeURI(pagePath + item.page) : item.doc_url || item.link
  //                 const itemIsPublic = item.public
  //                 const itemIsInternal = item.internal
  //                 const itemClass = item.class
  //             %>
  //             <% if (hasGuidewireEmail) { %>
  //                 <% const innerItems = item.items ? item.items : [] %>
  //                 <%= createItemElement(itemClass, itemHref, itemLabel, innerItems, itemIsPublic, itemIsInternal) %>
  //             <% } else if (!hasGuidewireEmail) { %>
  //                 <% const itemIsInternal = item.internal %>
  //                 <% const itemRegularInnerItems = item.items ? item.items.filter(i => !i.internal) : [] %>
  //                 <% if (!itemIsInternal) { %>
  //                     <%= createItemElement(itemClass, itemHref, itemLabel, itemRegularInnerItems, itemIsPublic, itemIsInternal) %>
  //                 <% } %>
  //             <% } %>
  return (
    <div className={className}>
      <LabelOrLink label={label} id={id} link={link} page={page} />
      {items && items.map((item, key) => <PageItem {...item} key={key} deploymentEnv={deploymentEnv} />)}
    </div>
  );
}
