export type VersionSelectorItem = {
  label: string;
  releases: string[];
  versions: string[];
  url: string;
  currentlySelected?: boolean;
};

export type VersionSelectorObject = {
  allVersions: VersionSelectorItem[];
};
