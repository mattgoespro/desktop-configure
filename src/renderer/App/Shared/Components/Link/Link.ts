import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import { createStyledComponent } from "../../theme/theme";

export const Link = createStyledComponent(MuiLink, {
  name: "Link",
  slot: "Root"
})<MuiLinkProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline"
  },
  "&:active": {
    textDecoration: "underline"
  }
}));
