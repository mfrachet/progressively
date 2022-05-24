import { styled } from "~/stitches.config";
import { Heading } from "./Heading";

export const RawH1 = styled(Heading, {
  fontSize: "$title",
  fontFamily: "$default",
  fontWeight: "$bold",
  lineHeight: "$title",
});

export const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (
  props
) => {
  return <RawH1 as="h1" id="page-title" {...props} />;
};
