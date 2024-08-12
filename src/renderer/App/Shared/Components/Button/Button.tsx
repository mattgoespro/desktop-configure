import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  ButtonOwnProps,
  Theme
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { CSSProperties } from "styled-components";
import { createStyledComponent } from "../../theme/theme";
import { typographyOf } from "../../theme/typography/typography";

type ButtonProps = { variant: "link" | "icon" };
type ButtonVariants = ButtonOwnProps["variant"] extends OverridableStringUnion<
  infer Defaults extends string,
  infer Overrides
>
  ? Defaults | ButtonProps["variant"] | Overrides
  : never;

const styleButtonVariant = (theme: Theme, variant: ButtonVariants) => {
  const typography = typographyOf(theme, "button") as CSSProperties;
  let style: Record<string, unknown> = {
    ...typography,
    padding: theme.spacing(1.5, 2),
    cursor: "pointer",
    "&:disabled": {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[700],
      cursor: "not-allowed"
    }
  };

  switch (variant) {
    case "icon":
      style = {
        ...style,
        border: "1px solid",
        borderColor: "transparent",
        padding: 0,
        minWidth: 0,
        width: 40,
        height: 40
      };
      break;
    case "contained":
      style = {
        ...style,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderRadius: theme.shape.borderRadius,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.primary.dark
        },
        "&:active": {
          backgroundColor: theme.palette.primary.dark,
          transform: "scale(0.98)"
        }
      };
      break;
    case "outlined":
      style = {
        ...style,
        backgroundColor: theme.palette.background.grey,
        color: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        borderColor: theme.palette.primary.main,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white
        }
      };
      break;
    case "text":
      style = {
        ...style,
        backgroundColor: theme.palette.background.grey,
        color: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        borderColor: theme.palette.primary.main,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white
        }
      };
      break;
    default:
      return style;
  }

  return style;
};
export const Button = createStyledComponent(MuiButton, {
  name: "Button",
  slot: "Root"
})<MuiButtonProps>(({ theme, variant }) =>
  styleButtonVariant(theme, variant)
) as unknown as typeof MuiButton;
