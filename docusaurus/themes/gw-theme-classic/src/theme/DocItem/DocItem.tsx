import React, { useState } from 'react';
import InitialDocItem from '@theme-init/DocItem';
import EarlyAccess from '@theme/EarlyAccess';
import Internal from '@theme/Internal';

interface DocItemContextProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export const DocItemContext: React.Context<DocItemContextProps | null> =
  React.createContext(null);

export default function DocItem(props) {
  const { internal } = props.content.frontMatter;
  const [topicTitle, setTopicTitle] = useState(props.content.metadata.title);

  function CustomizedDocItem() {
    return (
      <DocItemContext.Provider
        value={{ title: topicTitle, setTitle: setTopicTitle }}
      >
        <EarlyAccess />
        <InitialDocItem {...props} />
      </DocItemContext.Provider>
    );
  }

  if (internal) {
    return (
      <DocItemContext.Provider
        value={{ title: topicTitle, setTitle: setTopicTitle }}
      >
        <Internal showInfo>
          <CustomizedDocItem />
        </Internal>
      </DocItemContext.Provider>
    );
  }

  return <CustomizedDocItem />;
}

export function useDocItemContext() {
  const context = React.useContext(DocItemContext);
  if (!context) {
    throw new Error(
      'useDocItemContext must be used within a DocItemContextProvider'
    );
  }
  return context;
}
