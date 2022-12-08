import Logo from "./Logo/Logo";
import SearchBox from "../../SearchBox/SearchBox";
import ExternalSites from "./ExternalSites";
import Glossary from "./Glossary";
import TranslatedPages from "./TranslatedPages";
import UserProfile from "./UserProfile";
import { HeaderOptions } from "../Layout";
import Stack from "@mui/material/Stack";

export default function Header(headerOptions: HeaderOptions) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      height={{ xs: "auto", sm: "80px" }}
      alignItems="center"
      justifyContent={{ xs: "center", sm: "space-between" }}
      spacing={{ xs: 1, sm: 2 }}
      sx={{
        width: "100%",
        backgroundColor: "hsl(216, 42%, 13%)",
        padding: "6px 20px 6px 6px"
      }}
    >
      <Logo />
      {!headerOptions?.hideSearchBox && (
        <SearchBox
          bigSize={false}
          searchFilters={headerOptions?.searchFilters}
        />
      )}
      <Stack
        direction="row"
        justifyContent={{ xs: "center", sm: "right" }}
        width={{ sm: "100%", md: "400px" }}
        spacing={2}
      >
        <ExternalSites />
        <Glossary />
        <TranslatedPages />
        <UserProfile />
      </Stack>
    </Stack>
  );
}
