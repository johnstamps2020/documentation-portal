import { UserInformation, VersionSelectorObject } from '@doctools/core';

declare global {
  interface Window {
    docProduct: string;
    docPlatform: string;
    docRelease: string;
    docVersion: string;
    docSubject: string;
    docTitle: string;
    docDisplayTitle: string;
    docLanguage: string;
    userInformation: UserInformation;
    matchingVersionSelector: VersionSelectorObject;
  }
}
