import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";
import SearchInput from "./SearchInput";

type RawSearchIndexItem = {
  subtitles: string;
  file: string;
  keywords: string;
  title: string;
  body: string;
};

type SearchItem = {
  subtitles: string[];
  file: string;
  keywords: string;
  title: string;
  body: string;
};

const fuseOptions: Fuse.IFuseOptions<SearchItem> = {
  keys: [
    { name: "title", weight: 0.3 },
    { name: "keywords", weight: 0.2 },
    { name: "subtitles", weight: 0.2 },
    { name: "body", weight: 0.3 },
  ],
};

export default function OfflineSearch() {
  const [fuse, setFuse] = useState<Fuse<SearchItem> | undefined>(undefined);

  async function loadFuse() {
    try {
      const response = await fetch("/search.json");
      if (!response.ok) {
        throw new Error(`Cannot fetch search index: ${response.status}`);
      }

      const rawIndex: RawSearchIndexItem[] = await response.json();
      const normalizedIndex: SearchItem[] = rawIndex.map(
        ({ subtitles, ...otherFields }) => ({
          subtitles: subtitles.split(","),
          ...otherFields,
        })
      );
      const searchIndex = Fuse.createIndex(fuseOptions.keys, normalizedIndex);

      const fuseInstance = new Fuse(normalizedIndex, fuseOptions, searchIndex);
      setFuse(fuseInstance);
    } catch (err) {
      console.error("SEARCH ERROR", err);
    }
  }

  useEffect(function () {
    loadFuse();
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const target = e.target as typeof e.target & {
        q: { value: string };
      };
      const query = target.q.value;
      console.log({ query });
      const result = fuse.search(query);
      console.log({ result });
    } catch (err) {
      console.error("Problem running search", err);
    }
  }

  if (!fuse) {
    return <div>Loading...</div>;
  }

  return <SearchInput onSubmit={handleSubmit} />;
}
