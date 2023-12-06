import Typography from '@mui/material/Typography';

type EntityDescriptionProps = {
  prop1: { key: string; value: string };
  prop2?: { key: string; value: string };
  prop3?: { key: string; value: string };
};

export default function EntityDescription({
  prop1,
  prop2,
  prop3,
}: EntityDescriptionProps) {
  return (
    <>
      <Typography variant="subtitle1" component="div">
        <b>{prop1.key}</b>: {prop1.value}
      </Typography>
      {prop2 && (
        <Typography variant="subtitle1" component="div">
          <b>{prop2.key}</b>: {prop2.value}
        </Typography>
      )}
      {prop3 && (
        <Typography variant="subtitle1" component="div">
          <b>{prop3.key}</b>: {prop3.value}
        </Typography>
      )}
    </>
  );
}
