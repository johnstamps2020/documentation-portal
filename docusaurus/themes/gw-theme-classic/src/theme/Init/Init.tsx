import { SearchMeta } from '@doctools/core';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useDocContext } from '@theme/DocContext';
import React, { useEffect } from 'react';
import { PluginData } from '../../types';
import { PLUGIN_NAME } from '../../types/constants';

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
  const configuredAuthors =
    (siteConfig.customFields?.authors as string[]) || [];
  const { gwDocId } = usePluginData(PLUGIN_NAME) as PluginData;

  async function fetchUserInformation() {
    try {
      const userResponse = await fetch(`/userInformation`);
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
    fetchUserInformation();
    fetchAvailableVersions();
    fetchDocMetadata();
    setAuthors(configuredAuthors);
  }

  useEffect(function () {
    doSetup();
  }, []);

  return <div>{props.children}</div>;
}
