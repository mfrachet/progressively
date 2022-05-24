import { styled } from "~/stitches.config";

export const CardGroup = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridColumnGap: "$spacing$4",
  gridRowGap: "$spacing$4",
});

export const Card = styled("div", {
  maxWidth: "$cardWidth",
  background: "$backgroundAccent",
  borderRadius: "$borderRadius$regular",
  padding: "$spacing$10 0",
});

export const CardHeader = styled("div", {
  padding: "0 $spacing$10 $spacing$3 $spacing$10",
  fontFamily: "$default",
  "& a": {
    color: "$title",
  },
});

export const CardContent = styled("div", {
  padding: "0 $spacing$10",
  "& p": {
    fontSize: "$btn",
  },
});
