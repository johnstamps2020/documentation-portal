import EditButton from 'components/AdminPage/EditButton';
import EntityCard from 'components/AdminPage/EntityCard';
import EntityLink from 'components/AdminPage/EntityLink';
import ExternalLinkSettingsForm from '../ExternalLinkSettingsForm';
import DeleteButton from './Buttons/DeleteButton';
import DuplicateButton from './Buttons/DuplicateButton';

type ExternalLinkCardProps = {
  label: string;
  url: string;
};

export default function ExternalLinkCard({
  label,
  url,
}: ExternalLinkCardProps) {
  return (
    <EntityCard
      title={label}
      cardContents={<EntityLink url={url} label={url} />}
      cardButtons={
        <>
          <EditButton
            buttonLabel="Open external link editor"
            dialogTitle="Update external link settings"
            formComponent={<ExternalLinkSettingsForm url={url} />}
          />
          <DuplicateButton externalLinkUrl={url} />
          <DeleteButton externalLinkUrl={url} />
        </>
      }
    />
  );
}
