import React from 'react';
import LabelOrLink from './LabelOrLink';
import type { PageItem as Item } from '../../model/entity/PageItem';
import { Environment } from '../../types/environment';

type ItemProps = Item & {
  deploymentEnv: Environment;
}

export default function PageItem(props: ItemProps) {
  const {env, deploymentEnv, label, class: className, items} = props;
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
      <LabelOrLink {...props} />
      {items && items.map((item, key) => <PageItem {...item} key={key} deploymentEnv={deploymentEnv} />)}
    </div>
  );
}
