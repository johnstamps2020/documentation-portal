import { SearchMeta } from '@doctools/components';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useDocContext } from '@theme/DocContext';
import { PluginData } from '@theme/Types';
import mockUserData from '@theme/mockUserData';
import React, { useEffect } from 'react';
import { PLUGIN_NAME } from '../../types/constants';
import { versionSelectorMockup } from './versionSelectorMockup';

export default function Init(props) {
  const {
    setUserInformation,
    setAvailableVersions,
    setIsInternal,
    setIsEarlyAccess,
    setSearchMeta,
    setAuthors,
  } = useDocContext();
  const context = useDocusaurusContext();
  const { siteConfig } = context;
  const configuredAuthors = siteConfig.customFields?.authors || [];
  const { gwDocId } = usePluginData(PLUGIN_NAME) as PluginData;
  const isDevelopment = process.env.NODE_ENV === 'development';

  function mockSetup() {
    setUserInformation(mockUserData.internal);
    setIsInternal(false);
    setIsEarlyAccess(false);
    setSearchMeta({
      docTitle: 'Webhooks API Reference',
      docInternal: false,
      docEarlyAccess: true,
      product: ['BillingCenter', 'ClaimCenter', 'PolicyCenter'],
      platform: ['Cloud'],
      version: ['latest'],
      release: ['Elysian'],
      subject: ['Integration'],
    });
    setAvailableVersions(versionSelectorMockup);
    setAuthors(configuredAuthors);
  }

  async function fetchUserInformation() {
    try {
      const userResponse = await fetch('/userInformation');
      if (userResponse.ok) {
        const userJson = await userResponse.json();
        setUserInformation(userJson);
      }
    } catch (err) {
      setUserInformation({
        hasGuidewireEmail: false,
        isLoggedIn: false,
        error: err,
        preferred_username: 'not-logged-in',
        name: 'Falstaff',
      });
    }
  }

  async function fetchAvailableVersions() {
    try {
      const response = await fetch(
        `/safeConfig/versionSelectors/?docId=${gwDocId}`
      );

      if (!response.ok) {
        throw new Error(
          `Request to server failed? ${JSON.stringify(response, null, 2)}`
        );
      }

      const json = await response.json();
      const allVersions = json.matchingVersionSelector.allVersions;
      setAvailableVersions(allVersions);
    } catch (err) {
      console.error('PROBLEM GETTING OTHER VERSIONS', err);
    }
  }

  async function fetchDocMetadata() {
    try {
      const response = await fetch(`/safeConfig/docMetadata/${gwDocId}`);

      if (!response.ok) {
        throw new Error(
          `Cannot fetch doc metadata for ${gwDocId}: ${JSON.stringify(
            response,
            null,
            2
          )}`
        );
      }

      const searchMeta: SearchMeta = await response.json();

      setSearchMeta(searchMeta);
      setIsEarlyAccess(searchMeta.docEarlyAccess);
      setIsInternal(searchMeta.docInternal);
    } catch (err) {
      console.error('PROBLEM GETTING DOC METADATA', err);
    }
  }

  async function doSetup() {
    if (isDevelopment) {
      mockSetup();
    } else {
      fetchUserInformation();
      fetchAvailableVersions();
      fetchDocMetadata();
      setAuthors(configuredAuthors);
    }
  }

  useEffect(function () {
    doSetup();
  }, []);

  return <div>{props.children}</div>;
}
