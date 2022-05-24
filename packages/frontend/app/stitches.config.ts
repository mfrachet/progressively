import { createStitches } from "@stitches/react";

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      title: "white",
      background: "#151722",
      border: "rgb(36, 38, 49)",
      backgroundAccent: "rgb(26, 28, 39)",
      primary: "hsl(340deg, 82%, 42%)",
      content: "#9ba1a6",
      hover: "hsl(340deg, 82%, 95%)",
    },
    sizes: {
      container: "1080px",
      cardHeight: "100px",
    },
    fontSizes: {
      content: "1.25rem",
      btn: "1rem",
      title: "3.5rem",
      h2: "2rem",
      h3: "1.6rem",
    },
    fonts: {
      default: "Untitled Sans, apple-system, sans-serif",
    },
    fontWeights: {
      normal: "normal",
      semiBold: "500",
      bold: "800",
    },
    lineHeights: {
      content: "1.6",
      title: "2",
    },
    borderRadius: {
      regular: "8px",
    },
    spacing: {
      0: "0px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
    },
  },
});
