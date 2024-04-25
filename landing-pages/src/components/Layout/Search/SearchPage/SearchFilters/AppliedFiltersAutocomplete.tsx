import { ServerSearchFilter } from '@doctools/server';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useSearchData } from 'hooks/useApi';
import {
  useLanguagesNoRevalidation,
  usePlatformsNoRevalidation,
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
  useSubjectsNoRevalidation,
} from '@doctools/server';
import AppliedFiltersSkeleton from '../AppliedFiltersSkeleton';
import { useEffect, useMemo, useState } from 'react';
import AppliedFilterControl from './AppliedFilterControl';
import { uiFilters } from './SearchFilterPanel';
import AppliedFilterAutocomplete from './AppliedFilterAutocomplete';
import {
  Language,
  Platform,
  Product,
  Release,
  Subject,
} from '@doctools/server';

// not all of these filters can be checked but including the full list
// in case the displayed filters changes
const filterOrder = [
  'product',
  'release',
  'version',
  'doc_title',
  'doc_display_title',
  'subject',
  'platform',
  'language',
];
const customSort = (a: ServerSearchFilter, b: ServerSearchFilter) => {
  const indexA = filterOrder.indexOf(a.name);
  const indexB = filterOrder.indexOf(b.name);
  return indexA - indexB;
};

export default function AppliedFilters() {
  const { searchData, isLoading, isError } = useSearchData();
  const [checkedFilters, setCheckedFilters] = useState<ServerSearchFilter[]>();

  const { languages: allLanguages } = useLanguagesNoRevalidation();
  const { platforms: allPlatforms } = usePlatformsNoRevalidation();
  const { products: allProducts } = useProductsNoRevalidation();
  const { releases: allReleases } = useReleasesNoRevalidation();
  const { subjects: allSubjects } = useSubjectsNoRevalidation();

  const allFilters = useMemo(() => {
    if (
      !allLanguages ||
      !allPlatforms ||
      !allProducts ||
      !allReleases ||
      !allSubjects
    )
      return {
        language: [],
        platform: [],
        product: [],
        release: [],
        subject: [],
      };
    return {
      language: allLanguages
        .sort((a: Language, b: Language) => a.label.localeCompare(b.label))
        .map((p: Language) => p.label),
      platform: allPlatforms
        .sort((a: Platform, b: Platform) => a.name.localeCompare(b.name))
        .map((p: Platform) => p.name),
      product: allProducts
        .sort((a: Product, b: Product) => a.name.localeCompare(b.name))
        .map((p: Product) => p.name),
      release: allReleases
        .sort((a: Release, b: Release) => b.name.localeCompare(a.name))
        .map((r: Release) => r.name),
      subject: allSubjects
        .sort((a: Subject, b: Subject) => a.name.localeCompare(b.name))
        .map((p: Subject) => p.name),
    };
  }, [allLanguages, allPlatforms, allProducts, allReleases, allSubjects]);

  //console.log(allFilters);

  useEffect(() => {
    if (searchData) {
      //console.log(searchData.filters);
      const currentlyChecked = searchData.filters
        .map((f) => {
          // This guarding clause checks if the filter is listed in uiFilters
          // or as one of the sub-filters of an existing uiFilter
          if (
            !uiFilters.some(
              (uiFilter) =>
                uiFilter.name === f.name ||
                uiFilter.filters?.some((subFilter) => subFilter.name === f.name)
            )
          ) {
            return null;
          }
          const checkedValues = f.values.filter((v) => v.checked);
          if (checkedValues.length > 0) {
            return {
              ...f,
              values: checkedValues,
            };
          }

          return null;
        })
        .filter(Boolean) as ServerSearchFilter[];

      if (currentlyChecked.length > 0) {
        setCheckedFilters(currentlyChecked);
      } else {
        setCheckedFilters([]);
      }
    }
  }, [searchData, searchData?.filters]);

  if (!searchData || isLoading) {
    return <AppliedFiltersSkeleton />;
  }

  if (isError || !checkedFilters || checkedFilters.length === 0) {
    return null;
  }
  //console.log(checkedFilters);
  const sortedFilters = checkedFilters.sort(customSort); //searchData.filters.sort(customSort); //

  return (
    <Stack
      direction={{ xs: 'column' }}
      spacing={1}
      gap={2}
      sx={{ width: '100%' }}
    >
      <Typography sx={{ padding: 0, minWidth: '110px' }}>
        Applied filters:
      </Typography>
      <Grid container spacing={0} direction="row" sx={{ width: '100%' }}>
        {/* {Object.entries(searchData.filters).map((entry) => {
          console.log(entry);
          return (
            <AppliedFilterAutocomplete
              allFilters={entry}
            />
          );
        })} */}
        {/* this goes through filters that have results. Probably want all available filters (allFilters) instead. */}
        {searchData.filters.map((filter) => {
          //console.log(filter);
          return (
            <AppliedFilterAutocomplete key={filter.name} allFilters={filter} />
          );
        })}
      </Grid>
    </Stack>
  );
}
