import { styled } from "~/stitches.config";
import { H1 } from "./H1";
import { Spacer } from "./Spacer";
import { Typography } from "./Typography";

export interface HeaderProps {
  title: string | React.ReactNode;
  description?: React.ReactNode;
  startAction?: React.ReactNode;
  tagline?: string;
}

const HeaderRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$spacing$10",
});

const TagLine = styled(Typography, {
  textTransform: "uppercase",
  fontSize: "$btn",
  fontWeight: "$slim",
  letterSpacing: "2px",
  marginBottom: "$spacing$1",
});

const HeadingWrapper = styled("div", {
  display: "flex",
  flexDirection: "column-reverse",
});

export const Header = ({
  title,
  description,
  startAction,
  tagline,
}: HeaderProps) => {
  return (
    <div>
      <HeadingWrapper>
        <H1>{title}</H1>
        {tagline && <TagLine>{tagline}</TagLine>}
      </HeadingWrapper>

      {description || startAction ? <Spacer size={2} /> : null}

      {description}

      {startAction && <HeaderRow>{startAction}</HeaderRow>}
    </div>
  );
};
