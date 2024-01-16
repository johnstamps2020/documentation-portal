import { EditMultipleContextProvider } from './EditMultipleContext';
import EditMultipleForm from './EditMultipleForm';

export default function EditMultipleWrapper() {
  return (
    <EditMultipleContextProvider>
      <EditMultipleForm />
    </EditMultipleContextProvider>
  );
}
