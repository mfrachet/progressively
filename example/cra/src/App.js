import React from "react";
import { RolloutProvider, useFlags } from "@rollout/react";

window.REACT1 = React;

const FlaggedComponent = () => {
  const { flags } = useFlags();

  if (flags.newHomepage) {
    return <div style={{ background: "red", color: "white" }}>New variant</div>;
  }

  return <div style={{ background: "lightblue" }}>Old variant</div>;
};

const Home = ({ rolloutProps }) => {
  return (
    <RolloutProvider clientKey="valid-sdk-key">
      <main>
        <FlaggedComponent />
      </main>
    </RolloutProvider>
  );
};

export default Home;
