import { Link, Container } from "@mui/material";

type selfManagedProps = {
  pagePath: string;
  backgroundImage: string;
};

export default function SelfManagedLink({
  pagePath,
  backgroundImage,
}: selfManagedProps) {
  let link;
  let selfManagedOrCloud;
  if (pagePath === "selfManagedProducts") {
    selfManagedOrCloud = "Guidewire Cloud";
    link = "/";
  } else {
    selfManagedOrCloud = "self-managed";
    link = "/landing/selfManagedProducts";

  return (
    <Container
      style={{ marginLeft: 0, marginTop: 20, paddingLeft: 0 }}
    >
      <Link
        href={selfManaged ? "/" ? "/landing/selfManagedProducts"}
        underline="always"
        style={{ fontWeight: "bold" }}
        sx={
          backgroundImage
            ? { color: "white", textDecorationColor: "white" }
            : { color: "black", textDecorationColor: "black" }
        }
      >
        {`Click here for ${selfManaged ? "Guidewire Cloud" : "self-managed"} documentation`}
      </Link>
    </Container>
  );
}
