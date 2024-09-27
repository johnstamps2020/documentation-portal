// Following after @docusaurus/thee-classic, note copied form there:
// This file, like all the other ambient declaration files for plugins, is
// needed for TS to understand our `@theme` alias. The export signatures are
// duplicated from the implementation, which is fine, since every module only
// default-exports a React component.
// TODO we'll eventually migrate to TS `paths` option. This is not easy due to
// our theme shadowing—we probably need the user to specify multiple theme paths
// in their tsconfig.
import React from 'react';

declare module '@doctools/gw-theme-classic' {}

declare module '@theme/Internal' {
  export type InternalProps = {
    children: React.ReactNode;
    showInfo?: boolean;
    hidePrompt?: boolean;
  };

  export default function Internal(props: InternalProps): JSX.Element;
}

declare module '@theme/RightWrong' {
  export type RightWrongProps = {
    children: JSX.Element | JSX.Element[] | string;
  };

  export type RightWrongCardProps = {
    children: JSX.Element | JSX.Element[] | string;
    title?: string;
  };

  export type RightWrongImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    caption?: JSX.Element | JSX.Element[] | string;
    wrapperStyle?: CSSProperties;
  };

  export function RightWrong({ children }: RightWrongProps): JSX.Element;
  export function Right(props: RightWrongCardProps): JSX.Element;
  export function Wrong(props: RightWrongCardProps): JSX.Element;
  export function RightWrongImages({ children }: RightWrongProps): JSX.Element;
  export function RightImage(props: RightWrongImageProps): JSX.Element;
  export function WrongImage(props: RightWrongImageProps): JSX.Element;
}

declare module '@theme/Types' {
  export { PluginData } from './types';
}

declare module '@theme/VideoWrapper' {
  export type VideoObject = {
    title?: string;
    description?: JSX.Element | JSX.Element[];
    transcript?: string;
    videoId?: string;
    ariaLabelForDownload?: string;
    src?: string;
    width?: string;
  };

  export default function VideoWrapper(props: VideoObject): JSX.Element;
}

declare module '@theme/DocContext' {
  export interface DocContextInterface {
    userInformation: UserInformation;
    setUserInformation: React.Dispatch<React.SetStateAction<UserInformation>>;
    availableVersions: VersionSelectorProps[];
    setAvailableVersions: React.Dispatch<
      React.SetStateAction<VersionSelectorProps[]>
    >;
    isInternal: boolean;
    setIsInternal: React.Dispatch<boolean>;
    isEarlyAccess: boolean;
    setIsEarlyAccess: React.Dispatch<boolean>;
    searchMeta: SearchMeta;
    setSearchMeta: React.Dispatch<SearchMeta>;
    authors: string[];
    setAuthors: React.Dispatch<string[]>;
    isProd: boolean;
  }

  export type DocContextProviderProps = {
    children:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | React.ReactFragment
      | React.ReactPortal;
  };

  export function DocContextProvider(
    props: DocContextProviderProps
  ): JSX.Element;

  export default function DocContext(props): JSX.Element;
}

declare module '@theme/Collapsible' {
  export type CollapsibleProps = {
    title?: string;
    children: JSX.Element | JSX.Element[] | string | null;
  };

  export default function Collapsible(props: CollapsibleProps): JSX.Element;
}
