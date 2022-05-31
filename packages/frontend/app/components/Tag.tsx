import { styled } from "~/stitches.config";

export const Tag = styled("span", {
  padding: "$spacing$2 $spacing$3",
  borderRadius: "$borderRadius$regular",
  background: "$hover",
  color: "$background",
  fontFamily: "$default",
  whiteSpace: "nowrap",
  fontSize: "$btn",
});
