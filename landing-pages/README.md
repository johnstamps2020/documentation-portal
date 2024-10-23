# Landing pages

They are pages where you land. I guess.

## i18n, localization, globalization

We use FormatJS and React.intl to ensure this site is localized and available in
multiple languages.

### Adding translatable test to the interface

If you want to add a piece of translatavble text to your interface:

1. Import `useIntl`
   ```
   import { useIntl } from 'react-intl';
   ```
1. Initialize the hook in the component
   ```
   const intl = useIntl();
   ```
1. Insert the `formatMessage` function
   ```
   <Typography>
       {intl.formatMessage({
       defaultMessage:
           'This page is available only to people with a Guidewire email. Do not share the link with external stakeholders because they will not be able to see the contents.',
       })}
   </Typography>
   ```
   Do not add IDs. This will help avoid collision.
1. Extract the translatable strings from all components:
   ```
   yarn workspace @doctools/landing-pages extract
   ```
1. Compile the extracted strings:
   ```
   yarn workspace @doctools/landing-pages compile
   ```

The strings are extracted into `landing-pages/i18n/en.json`. Now wait for the
Globalization team to translate the new strings into the remaining languages.
After they do, the contents of the other language files in the
`landing-pages/i18n` will be updated. So, you need to compile again and commit
your changes.

```
yarn workspace @doctools/landing-pages compile
```
