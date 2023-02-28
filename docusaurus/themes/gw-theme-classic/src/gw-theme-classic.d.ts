// Following after @docusaurus/thee-classic, note copied form there:
// This file, like all the other ambient declaration files for plugins, is
// needed for TS to understand our `@theme` alias. The export signatures are
// duplicated from the implementation, which is fine, since every module only
// default-exports a React component.
// TODO we'll eventually migrate to TS `paths` option. This is not easy due to
// our theme shadowing—we probably need the user to specify multiple theme paths
// in their tsconfig.

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
    title?: string;
    children: JSX.Element | JSX.Element[] | string;
  };

  export function RightWrong({ children }: RightWrongProps): JSX.Element;
  export function Right(props: RightWrongCardProps): JSX.Element;
  export function Wrong(props: RightWrongCardProps): JSX.Element;
}

declare module '@theme/Types' {
  export type PluginData = {
    internalDocIds: string[];
    gwDocId: string;
    appBaseUrl: string;
  };

  export type UserInformation = {
    hasGuidewireEmail: boolean;
    isLoggedIn: boolean;
    preferred_username: string;
    name: string;
    error?: any;
  };

  export type SearchMeta = {
    docTitle: string;
    docInternal: boolean;
    docEarlyAccess: boolean;
    product: string[];
    platform: string[];
    version: string[];
    release: string[];
    subject: string[];
  };
}

declare module '@theme/Feedback' {
  export type FeedbackDialogProps = {
    open: boolean;
    onClose: () => void;
    positive: boolean;
    userInformation: UserInformation;
    title: string;
    searchMeta: SearchMeta;
    jiraApiUrl: string;
    url: string;
    showNotification: (
      severity: AlertProps['severity'],
      message: JSX.Element
    ) => void;
    possibleContacts: string;
  };

  export type FeedbackProps = {
    showLabel: boolean;
    jiraApiUrl: FeedbackDialogProps['jiraApiUrl'];
    searchMeta: FeedbackDialogProps['searchMeta'];
    title: FeedbackDialogProps['title'];
    url: FeedbackDialogProps['url'];
    userInformation: FeedbackDialogProps['userInformation'];
    possibleContacts?: string;
  };

  export default function Feedback(props: FeedbackProps): JSX.Element;
}

declare module '@theme/VideoWrapper' {
  export type VideoObject = {
    title?: string;
    description?: JSX.Element | JSX.Element[];
    transcript?: string;
    videoId: string;
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

  export function useDocContext();

  export function DocContextProvider(
    props: DocContextProviderProps
  ): JSX.Element;

  export default function DocContext(props): JSX.Element;
}

declare module '@theme/VersionSelector' {
  export type VersionSelectorProps = {
    versions: string[];
    releases: string[];
    url: string;
    label: string;
    currentlySelected?: boolean;
  };

  export default function VersionSelector(): JSX.Element;
}

declare module '@theme/Translate' {
  type TranslationValues = {
    [x: string]: JSX.Element | string;
  };

  export type TranslateBaseProps = {
    id: string;
    description?: string;
    message: string;
    values?: TranslationValues;
  };

  export type TranslateProps = {
    id: string;
    description?: string;
    children: string;
    values?: TranslationValues;
  };

  export default function Translate(props: TranslateProps): JSX.Element;

  export function translate(props: TranslateBaseProps): string;
}

declare module '@theme/Collapsible' {
  export type CollapsibleProps = {
    title?: string;
    children: JSX.Element | JSX.Element[] | string | null;
  };

  export default function Collapsible(props: CollapsibleProps): JSX.Element;
}
