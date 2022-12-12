import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionDetails, {
  AccordionDetailsProps
} from "@mui/material/AccordionDetails";
import AccordionSummary, {
  AccordionSummaryProps
} from "@mui/material/AccordionSummary";
import Button, { ButtonProps } from "@mui/material/Button";
import Link, { LinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";

export const StyledHeading1 = styled(Typography)<TypographyProps>(() => ({
  fontSize: 40,
  textAlign: "left",
  color: "black",
  fontWeight: 600
}));

export const StyledHeading2 = styled(Typography)<TypographyProps>(() => ({
  fontWeight: 600,
  fontSize: "1.375rem",
  color: "rgb(0, 116, 158)",
  textAlign: "left",
  paddingBottom: "16px"
}));

export const StyledAdvancedHelpTitle = styled(Typography)<TypographyProps>(
  () => ({
    fontSize: 30,
    textAlign: "left",
    color: "black",
    fontWeight: 600
  })
);

export const StyledAdvancedHelpSectionTitle = styled(Typography)<
  TypographyProps
>(() => ({
  fontWeight: 400,
  fontSize: 20,
  color: "black",
  textAlign: "left",
  paddingTop: "8px"
}));

export const StyledAccordion = (props: AccordionProps) => (
  <Accordion
    disableGutters={true}
    sx={{
      boxShadow: 0,
      border: 0,
      "&:before": {
        display: "none",
        maxHeight: "40px"
      }
    }}
    {...props}
  >
    {props.children}
  </Accordion>
);

export const StyledAccordionSummary = styled(AccordionSummary)<
  AccordionSummaryProps
>(() => ({
  fontSize: "0.85rem",
  fontWeight: 600,
  textTransform: "uppercase",
  flexDirection: "row-reverse",
  padding: 0
}));

export const StyledAccordionDetails = styled(AccordionDetails)<
  AccordionDetailsProps
>(() => ({
  marginLeft: "6px"
}));

export const StyledLink = (props: LinkProps) => (
  <Link
    underline="hover"
    sx={{
      fontSize: "0.875rem",
      paddingBottom: "0.25rem",
      width: "fit-content",
      cursor: "pointer"
    }}
    {...props}
  ></Link>
);

export const StyledButton = styled(Button)<ButtonProps>(() => ({
  fontSize: "0.75rem",
  width: "100%"
}));
