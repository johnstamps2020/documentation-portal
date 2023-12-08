import Typography from '@mui/material/Typography';

type EntityDescriptionProps = {
  propList: { key: string; value: string }[];
};

export default function EntityDescription({
  propList,
}: EntityDescriptionProps) {
  return (
    <>
      {propList.map((prop) => (
        <Typography variant="subtitle1" component="div" key={prop.key}>
          <b>{prop.key}</b>: {prop.value}
        </Typography>
      ))}
    </>
  );
}
