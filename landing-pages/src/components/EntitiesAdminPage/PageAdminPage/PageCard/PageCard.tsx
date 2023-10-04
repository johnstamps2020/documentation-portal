import EditButton from 'components/AdminPage/EditButton';
import EntityCard from 'components/AdminPage/EntityCard';
import EntityLink from 'components/AdminPage/EntityLink';
import PageSettingsForm from '../PageSettingsForm';
import DeleteButton from './Buttons/DeleteButton';
import DuplicateButton from './Buttons/DuplicateButton';

type PageCardProps = {
  title: string;
  path: string;
};

export default function PageCard({ title, path }: PageCardProps) {
  return (
    <EntityCard
      title={title}
      cardContents={<EntityLink url={`/${path}`} label={path} />}
      cardButtons={
        <>
          <EditButton
            buttonLabel="Open page editor"
            dialogTitle="Update page settings"
            formComponent={<PageSettingsForm pagePath={path} />}
          />
          <DuplicateButton pagePath={path} />
          <DeleteButton pagePath={path} />
        </>
      }
    />
  );
}
