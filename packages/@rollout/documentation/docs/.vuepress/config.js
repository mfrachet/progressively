module.exports = {
  title: "Rollout Documentation",
  description: "The feature flag solution guides and docs",

  themeConfig: {
    search: false,
    sidebar: [
      {
        title: "Introduction",
        collapsable: false,
        children: [
          {
            title: "Overview",
            path: "/introduction/overview",
          },
          {
            title: "Get started",
            path: "/introduction/get-started",
          },
        ],
      },
      {
        title: "Guides",
        collapsable: false,
        children: [
          {
            title: "React (client)",
            path: "/guides/react",
          },
          {
            title: "React (server)",
            path: "/guides/react-ssr",
          },
          {
            title: "JavaScript",
            path: "/guides/javascript",
          },
        ],
      },
    ],
    displayAllHeaders: true,
  },
};
