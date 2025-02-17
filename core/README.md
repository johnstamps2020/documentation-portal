# @doctools/core

This package contains all the components we want to reuse between the different
apps in this repo.

## Previewing changes

From the root of the repo, run the following command:

```sh
yarn dev:core
```

## Creating a component

To add a component, create the following files:

- `src/components/ComponentName/ComponentName.tsx`
- `src/components/ComponentName/index.ts`

The `ComponentName.tsx` file should contain the component itself.

**IMPORTANT**: Do **not** use default exports! Always use named exports only.
For example, the `ComponentName.tsx` file should contain the following:

```tsx
import React from 'react';

export function ComponentName() {
  return <div>ComponentName</div>;
}
```

and the `index.ts` file should contain the following:

```ts
export * from './ComponentName';
```

## Adding a component to the library

For the component to be available in '@doctools/core', you need to add it to the
`src/components/index.ts` file:

```ts
export * from './ComponentName';
```

If the component is internal only, you do not need to add it to the
`src/index.ts` file.
