import glossary from 'images/twoColumn/book-open-solid.svg';
import development from 'images/twoColumn/code-solid.svg';
import configuration from 'images/twoColumn/cogs-solid.svg';
import features from 'images/twoColumn/object-group-regular.svg';
import integration from 'images/twoColumn/puzzle-piece-solid.svg';
import administration from 'images/twoColumn/users-cog-solid.svg';
import installation from 'images/twoColumn/wrench-solid.svg';
import releaseNotes from 'images/twoColumn/file-alt-regular.svg';
import bestPractices from 'images/twoColumn/lightbulb-regular.svg';
import aboutThisDocumentation from 'images/twoColumn/book-solid.svg';

const icons = [
  { regex: /glossary/, src: glossary },
  { regex: /development/, src: development },
  { regex: /configuration/, src: configuration },
  { regex: /features/, src: features },
  { regex: /application-specific/, src: features },
  { regex: /integration/, src: integration },
  { regex: /administration/, src: administration },
  { regex: /installation/, src: installation },
  { regex: /release notes/, src: releaseNotes },
  { regex: /test process/, src: development },
  { regex: /cross-application/, src: development },
  { regex: /best practices/, src: bestPractices },
  { regex: /about/, src: aboutThisDocumentation },
];

function getIcon(label: string) {
  const matchingIcon = icons.find((icon) =>
    icon.regex.test(label.toLocaleLowerCase())
  );

  return matchingIcon?.src || releaseNotes;
}

type SectionIconProps = {
  label: string;
};

export default function SectionIcon({ label }: SectionIconProps) {
  return (
    <img
      src={getIcon(label)}
      alt="Section icon"
      style={{
        width: '20px',
        height: '20px',
      }}
    />
  );
}
