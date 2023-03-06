import { useEffect, useState } from 'react';
import { Release } from 'server/dist/model/entity/Release';

export function useReleases() {
  const [releases, setReleases] = useState<string[]>([]);

  useEffect(() => {
    async function getReleases() {
      try {
        const response = await fetch('/safeConfig/entity/Release/all');
        if (!response.ok) {
          throw new Error(
            `Cannot get list of releases from server: ${response.status}`
          );
        }

        const json: Release[] = await response.json();
        setReleases(json.map(({ name }) => name));
      } catch (err) {
        console.error(err);
      }
    }

    getReleases();
  }, []);

  return releases;
}
