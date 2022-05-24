import { styled } from "~/stitches.config";

export const Spacer = styled("div", {
  variants: {
    size: {
      1: {
        height: "$spacing$1",
      },
      2: {
        height: "$spacing$2",
      },
      3: {
        height: "$spacing$3",
      },
      4: {
        height: "$spacing$4",
      },
    },
  },
});
