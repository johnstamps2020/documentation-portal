import { MultipleOperationMode } from '../MultipleButton';
import { EditMultipleContextProvider } from './EditMultipleContext';
import EditMultipleForm from './EditMultipleForm';

type MultipleWrapperProps = {
  mode: MultipleOperationMode;
};

export default function EditMultipleWrapper({ mode }: MultipleWrapperProps) {
  return (
    <EditMultipleContextProvider>
      <EditMultipleForm mode={mode} />
    </EditMultipleContextProvider>
  );
}
