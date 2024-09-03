import Box from '@mui/material/Box';
import AccessControl from 'components/AccessControl/AccessControl';
import AddButton from 'components/AdminPage/AddButton';
import PageSettingsForm from 'components/AdminPage/PageAdminPage/PageSettingsForm';
import EditPagePropsButton from './EditPagePropsButton';

export default function AdminControls() {
  return (
    <AccessControl
      allowedOnEnvs={['dev', 'staging']}
      accessLevel="admin"
      doNotNavigate
    >
      <Box sx={{ display: 'flex', gap: 1, py: 1 }}>
        <EditPagePropsButton />
        <AddButton
          buttonLabel="Add page"
          dialogTitle="Create a new page"
          formComponent={<PageSettingsForm />}
          disabled={false}
        />
      </Box>
    </AccessControl>
  );
}
