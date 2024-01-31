import { translate } from '@doctools/components';
import React from 'react';

type SearchInputProps = {
  children?: JSX.Element | JSX.Element[];
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function SearchInput({ children, onSubmit }: SearchInputProps) {
  const searchFieldId = 'searchField';
  const placeholder = translate({
    id: 'gwSearchForm.placeholder',
    message: 'Search',
  });

  return (
    <form action="/search" onSubmit={onSubmit}>
      <div className="searchWrapper">
        <label htmlFor={searchFieldId} className="searchLabel">
          {placeholder}
        </label>
        <input
          type="search"
          name="q"
          autoComplete="off"
          placeholder={placeholder}
          id={searchFieldId}
          className={searchFieldId}
          aria-label={placeholder}
        />
        {children}
        <button type="submit" className="searchButton" aria-label={placeholder}>
          {placeholder}
        </button>
      </div>
    </form>
  );
}
