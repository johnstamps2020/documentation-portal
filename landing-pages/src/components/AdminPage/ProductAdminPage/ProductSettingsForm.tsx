import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNotification } from 'components/Layout/NotificationContext';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { Product } from '@doctools/server';
import { useProductData } from 'hooks/useEntitiesData';

type NewProduct = Omit<Product, 'uuid'>;

export const emptyProduct: NewProduct = {
  name: '',
  public: false,
  internal: false,
  earlyAccess: false,
  isInProduction: false,
};

type ProductSettingsFormProps = {
  primaryKey?: string;
  disabled?: boolean;
  initialProductData?: NewProduct;
};

async function sendRequest(url: string, { arg }: { arg: NewProduct }) {
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

function generateTmpProductData(productData: NewProduct | undefined) {
  return productData ? productData : emptyProduct;
}

export default function ProductSettingsForm({
  primaryKey: nameFromProps,
  disabled,
  initialProductData,
}: ProductSettingsFormProps) {
  const [productName, setProductName] = useState(nameFromProps);
  const { showMessage } = useNotification();
  const { productData, isError, isLoading } = useProductData(productName);
  const { trigger, isMutating } = useSWRMutation(
    '/admin/entity/Product',
    sendRequest
  );
  const [tmpProductData, setTmpProductData] = useState(
    generateTmpProductData(initialProductData)
  );
  const [editingDisabled, setEditingDisabled] = useState(
    disabled ? disabled : false
  );
  const [canSubmitData, setCanSubmitData] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [ProductAlreadyExists, setProductAlreadyExists] = useState<boolean>();
  const [jsonIsInvalid, setJsonIsInvalid] = useState<boolean>();

  useEffect(() => {
    productName &&
      productData &&
      setTmpProductData(generateTmpProductData(productData));
  }, [productData, productName]);

  useEffect(() => {
    if (disabled || isMutating) {
      return setEditingDisabled(true);
    }

    setEditingDisabled(false);
  }, [disabled, isMutating]);

  useEffect(() => {
    const dataForComparison = initialProductData || productData;
    if (
      JSON.stringify(tmpProductData) ===
      JSON.stringify(generateTmpProductData(dataForComparison))
    ) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  }, [tmpProductData, productData, productName, initialProductData]);

  useEffect(() => {
    if (
      isMutating ||
      ProductAlreadyExists ||
      jsonIsInvalid ||
      !tmpProductData.name
    ) {
      setCanSubmitData(false);
    } else {
      setCanSubmitData(true);
    }
  }, [
    productData,
    tmpProductData,
    ProductAlreadyExists,
    jsonIsInvalid,
    isMutating,
  ]);

  if (isError) {
    return (
      <Stack
        sx={{
          padding: 4,
        }}
      >
        <Typography variant="h2">Problem loading product data</Typography>
        <pre>
          <code>{JSON.stringify(isError, null, 2)}</code>
        </pre>
      </Stack>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  function handleChange(field: string, value: string | boolean) {
    setTmpProductData((currentTmpProductData) => ({
      ...currentTmpProductData,
      [field]: value,
    }));

    if (field === 'name') {
      setProductAlreadyExists(false);
    }
  }

  function handleResetForm() {
    const resetToData = productData || initialProductData;
    setTmpProductData(generateTmpProductData(resetToData));
    setProductAlreadyExists(false);
    setJsonIsInvalid(false);
  }

  async function checkIfProductExists(): Promise<boolean> {
    const response = await fetch(
      `/safeConfig/entity/Product?name=${tmpProductData.name}`
    );

    if (response.status === 404) {
      return false;
    }

    const jsonData = await response.json();

    return (
      jsonData.name === tmpProductData.name &&
      productData?.name !== tmpProductData.name
    );
  }

  async function handleSave() {
    try {
      const ProductExists = await checkIfProductExists();
      if (ProductExists) {
        setProductAlreadyExists(true);
        return;
      }
      let dataToSave = tmpProductData;
      const response = await trigger(dataToSave);

      if (response?.ok) {
        showMessage('Product saved successfully', 'success');
        setProductName(tmpProductData.name);
        setDataChanged(false);
      } else if (response) {
        const jsonError = await response.json();
        throw new Error(jsonError.message);
      }
    } catch (err) {
      showMessage(`Product not saved: ${err}`, 'error');
    }
  }

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: 'center',
        backgroundColor: 'white',
        py: 4,
      }}
    >
      <TextField
        required
        error={ProductAlreadyExists}
        helperText={
          ProductAlreadyExists && 'Product with this name already exists'
        }
        disabled={editingDisabled}
        label="Name"
        value={tmpProductData.name}
        onChange={(event) => handleChange('name', event.target.value)}
        fullWidth
      />
      <FormGroup>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {['internal', 'public', 'earlyAccess', 'isInProduction'].map(
            (key) => (
              <FormControlLabel
                disabled={editingDisabled}
                key={key}
                control={
                  <Switch
                    value={key}
                    checked={
                      tmpProductData[key as keyof typeof productData] as boolean
                    }
                    onChange={(event) =>
                      handleChange(key, event.target.checked)
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={key}
              />
            )
          )}
        </Box>
      </FormGroup>
      <Stack direction="row" spacing={1}>
        <ButtonGroup disabled={disabled || !dataChanged}>
          <Button
            disabled={!canSubmitData}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="outlined" color="warning" onClick={handleResetForm}>
            Reset
          </Button>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}
