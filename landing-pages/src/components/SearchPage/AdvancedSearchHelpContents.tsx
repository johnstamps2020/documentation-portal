import Box from '@mui/material/Box';
import { StyledAdvancedHelpSectionTitle } from './StyledSearchComponents';
import { useTheme } from '@mui/material/styles';
import { useSearchLayoutContext } from './SearchLayoutContext';

export default function AdvancedSearchHelpContents() {
  const theme = useTheme();
  const { helpWidth } = useSearchLayoutContext();

  return (
    <Box
      sx={{
        width: helpWidth,
        padding: 3,
        [theme.breakpoints.down('sm')]: {
          width: 300,
        },
      }}
    >
      <StyledAdvancedHelpSectionTitle id="special_characters">
        Special characters
      </StyledAdvancedHelpSectionTitle>
      <ul>
        <li>
          <code>|</code> performs an <a href="#and_or">OR</a> search
        </li>
        <li>
          <code>-</code> <a href="#excluding_not">excludes</a> a single word
        </li>
        <li>
          <code>&quot;</code> surrounds a word or phrase to{' '}
          <a href="#exact_match">match exactly</a>
        </li>
        <li>
          <code>*</code> at the end of a term performs a{' '}
          <a href="#prefix">prefix</a> search
        </li>
        <li>
          <code>( )</code> <a href="#grouping">groups</a> terms for a single
          operator
        </li>
        <li>
          <code>~N</code> after a <strong>word</strong> relaxes spelling rules (
          <a href="#fuzziness">fuzziness</a>)
        </li>
        <li>
          <code>~N</code> after a <strong>phrase</strong> signifies{' '}
          <a href="#slop">slop</a> amount
        </li>
      </ul>
      <p>See below for more details.</p>
      <StyledAdvancedHelpSectionTitle id="and_or">
        AND, OR
      </StyledAdvancedHelpSectionTitle>
      <p>
        By default, the search returns pages that contain all of the words in
        your query. If you want to search for pages that contain the words
        “configure”, or “install”, or “manage”, enter:
      </p>
      <pre>
        <code>configure | install | manage</code>
      </pre>
      <StyledAdvancedHelpSectionTitle id="excluding_not">
        Excluding (NOT)
      </StyledAdvancedHelpSectionTitle>
      <p>
        If you want pages that contain the word “configure” and “manage” but not
        “install”, enter:
      </p>
      <pre>
        <code>configure manage -install</code>
      </pre>
      <p>The order of these words in your search query does not matter.</p>
      <StyledAdvancedHelpSectionTitle id="exact_match">
        Exact match
      </StyledAdvancedHelpSectionTitle>
      <p>
        If you want an exact phrase to match, surround it with double quotes:
      </p>
      <pre>
        <code>&quot;manage user accounts&quot;</code>
      </pre>
      <StyledAdvancedHelpSectionTitle id="grouping">
        Grouping
      </StyledAdvancedHelpSectionTitle>
      <p>
        Group multiple terms by enclosing them in parentheses. For example, the
        following excludes both the terms "install" and "manage":
      </p>
      <pre>
        <code>configure -(install manage)</code>
      </pre>
      <p>
        You can also combine double quotes with other operators. For example, to
        find the phrase “manage users” and the words “policy” or “group” but not
        “PolicyCenter”, enter:
      </p>
      <pre>
        <code>&quot;manage users&quot; (policy | group) -PolicyCenter</code>
      </pre>
      <p>A phrase in double quotes takes precedence in highlighting.</p>
      <p>
        Note that the search uses stemming, which means that if you search for
        “configure” then you will also see results for “configuring” and
        “configuration”. If you want to match a word exactly, use double quotes.
      </p>
      <StyledAdvancedHelpSectionTitle id="prefix">
        Prefix
      </StyledAdvancedHelpSectionTitle>
      <p>
        If you want to find words that have a common beginning, such as
        BigDecimal and BigInt, enter the prefix with an asterisk:
      </p>
      <pre>
        <code>big*</code>
      </pre>
      <p>
        If you have trouble finding pages with a prefix search, try using all
        lowercase letters.
      </p>
      <p>
        You cannot perform a suffix search (<code>*decimal</code>), but you can
        get more results using fuzziness.
      </p>
      <StyledAdvancedHelpSectionTitle id="fuzziness">
        Fuzziness
      </StyledAdvancedHelpSectionTitle>
      <p>
        You can relax the spelling rules a little if you add a ~ and a number
        after a word. For example, to find both “center” and “centre”, enter:
      </p>
      <pre>
        <code>centre~1</code>
      </pre>
      <StyledAdvancedHelpSectionTitle id="slop">
        Slop
      </StyledAdvancedHelpSectionTitle>
      <p>
        If you want to match phrases such as “Model Info screen”, “Model Details
        screen”, and other similar ones, you can surround a simple phrase with
        quotes and follow it by a ~ and a number.
      </p>
      <pre>
        <code>&quot;model screen&quot;~1</code>
      </pre>
      <p>
        The number specifies the amount of “slop” in the phrase. The previous
        query means that you’re looking for a phrase that contains the words
        “model” and “screen”, but one word can be inserted into the phrase
        between the first and the last word.
      </p>
      <p>If you specify something such as:</p>
      <pre>
        <code>&quot;gosu zones types&quot;~5</code>
      </pre>
      <p>
        This means to find a phrase containing the words “gosu”, “zones”, and
        “types”, and up to five other words can appear anywhere in the phrase
        between the first and the last word. For example, this query would match
        &quot;<strong>Gosu</strong> holiday methods that use
        <strong>zones</strong> and <strong>types</strong>&quot;.
      </p>
      <p>Have fun searching! 🙂</p>
    </Box>
  );
}
