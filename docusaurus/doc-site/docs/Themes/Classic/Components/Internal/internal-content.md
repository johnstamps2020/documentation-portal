# Internal content

Allows you to hide a piece of your site from external users. Only users with a
Guidewire email can see this portion.

import Note from "./\_internal-not-secure.mdx"

<Note/>

## In MDX

Here's an example of using the component in an MDX file. Note the extra blank
line around JSX tags to allow Markdown inside a JSX component.

```md
import Internal from '@theme/Internal'

## Announcements

<Internal>

### Clean up your cups!

Remember to clean up after yourself when you have coffee in the break room.

</Internal>

### Return policy

We have updated our return policy. Learn more at...
```

The resulting section looks like this:

import Internal from '@theme/Internal'

<Internal>

### Clean up your cups!

Remember to clean up after yourself when you have coffee in the break room.

</Internal>

## In JSX/TSX

You can use the `<Internal/>` component in your custom components on React
pages. To get code completion for the component,
[check out instructions about Typescript support](../../theme-typescript.mdx).

```jsx live
function Options() {
  return (
    <ul>
      <li>
        <button role="button">Buy</button>
      </li>
      <Internal>
        <li>
          <button role="button">Sell</button>
        </li>
      </Internal>
      <li>
        <button role="button">Return</button>
      </li>
    </ul>
  );
}
```

## Make a page internal

To make an entire page internal, see [Internal page](./internal-page.mdx).
