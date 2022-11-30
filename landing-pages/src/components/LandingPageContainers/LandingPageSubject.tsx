import LandingPageItem from "../LandingPageItems/LandingPageItem";
import { Subject } from "@documentation-portal/dist/model/entity/Subject";

import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, ImageListItem, ThemeProvider } from "@mui/material";
import { twoColumnsTheme } from "../../themes/twoColumnsTheme";
import bookOpenIcon from "../../images/twoColumn/book-open-solid.svg";
import codeIcon from "../../images/twoColumn/code-solid.svg";
import cogsIcon from "../../images/twoColumn/cogs-solid.svg";
import ObjectGroupIcon from "../../images/twoColumn/object-group-regular.svg";
import puzzlePieceIcon from "../../images/twoColumn/puzzle-piece-solid.svg";
import usersCogIcon from "../../images/twoColumn/users-cog-solid.svg";
import wrenchIcon from "../../images/twoColumn/wrench-solid.svg";

export default function LandingPageSubject(subject: Subject) {
  const iconArray = [
    bookOpenIcon,
    codeIcon,
    cogsIcon,
    ObjectGroupIcon,
    puzzlePieceIcon,
    usersCogIcon,
    wrenchIcon,
  ];
  const randomIcon = iconArray[Math.floor(Math.random() * iconArray.length)];

  return (
    <ThemeProvider theme={twoColumnsTheme}>
      <CssBaseline enableColorScheme />
      <Grid
        spacing={1}
        container
        display="flex"
        flexDirection="column"
        sx={{
          breakInside: "avoid",
          paddingBottom: "32px",
          paddingLeft: "16px",
          width: "450px",
        }}
      >
        <Grid container>
          <div style={{ width: "30px", height: "20px" }}>
            <ImageListItem>
              <img
                src={randomIcon}
                alt="logo"
                style={{
                  maxWidth: "20px",
                  maxHeight: "20px",
                }}
              />
            </ImageListItem>
          </div>
          <Typography variant="h2">{subject.label}</Typography>
        </Grid>
        <Grid marginLeft="42px">
          {subject.subjectItems.map((subjectItem) => (
            <LandingPageItem {...subjectItem} key={subjectItem.id} />
          ))}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
