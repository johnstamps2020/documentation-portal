import EntityCardValidationWarning from 'components/AdminPage/EntityCardValidationWarning';

type FileValidationWarningProps = {
  path: string;
};

export function checkIfFileExists(path: string) {
  try {
    require(`../../../pages/landing/${path}.tsx`);
    return true;
  } catch (err) {
    return false;
  }
}

export default function FileValidationWarning({
  path,
}: FileValidationWarningProps) {
  try {
    const fileExists = checkIfFileExists(path);
    if (!fileExists) {
      return (
        <EntityCardValidationWarning>
          React component for this page path doesn't exist in landing pages.
        </EntityCardValidationWarning>
      );
    }
    return <></>;
  } catch (err) {
    console.log(err);
    return <></>;
  }
}
