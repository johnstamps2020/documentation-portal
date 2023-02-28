import React from 'react';
import InitialDocSidebar from '@theme-init/DocSidebar';

function insertLineBreak(items) {
  const result = items.map((item) => {
    item.label = item.label.replace(/\//g, '/\u200B');
    if (item.type === 'category') {
      return { ...item, items: insertLineBreak(item.items) };
    }
    return item;
  });
  return result;
}

export default function DocSidebar(props) {
  const copyOfProps = JSON.parse(JSON.stringify(props));
  copyOfProps.sidebar = insertLineBreak(props.sidebar);
  return (
    <>
      <InitialDocSidebar {...copyOfProps} />
    </>
  );
}
