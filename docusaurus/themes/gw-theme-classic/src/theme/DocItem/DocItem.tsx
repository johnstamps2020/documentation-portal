import React, { useState } from 'react';
import InitialDocItem from '@theme-init/DocItem';
import EarlyAccess from '@theme/EarlyAccess';
import Internal from '@theme/Internal';
import { guidewireMetaPrefix } from '@doctools/core';
import Head from '@docusaurus/Head';

interface DocItemContextProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  isPublic: boolean;
}

export const DocItemContext: React.Context<DocItemContextProps | null> =
  React.createContext(null);

type DocItemWrapperProps = {
  internal: boolean;
  children: React.ReactNode;
};

function DocItemWrapper({ internal, children }: DocItemWrapperProps) {
  if (internal) {
    return <Internal showInfo>{children}</Internal>;
  }

  return <>{children}</>;
}

export default function DocItem(props) {
  const frontMatter = props.content.frontMatter;
  const [topicTitle, setTopicTitle] = useState(props.content.metadata.title);

  return (
    <DocItemContext.Provider
      value={{
        title: topicTitle,
        setTitle: setTopicTitle,
        isPublic: frontMatter.public !== undefined ? frontMatter.public : false,
      }}
    >
      <Head>
        {frontMatter.internal && (
          <meta name={`${guidewireMetaPrefix}internal`} content="true" />
        )}
        {frontMatter.public !== undefined && (
          <meta
            name={`${guidewireMetaPrefix}public`}
            content={frontMatter.public}
          />
        )}
      </Head>
      <EarlyAccess />
      <DocItemWrapper internal={frontMatter.internal}>
        <InitialDocItem {...props} />
      </DocItemWrapper>
    </DocItemContext.Provider>
  );
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
