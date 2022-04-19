import React from "react";
import { RolloutProvider } from "@rollout/react";

// const FlaggedComponent = () => {
//   const { flags } = useFlags();

//   if (flags.newHomepage) {
//     return <div style={{ background: "red", color: "white" }}>New variant</div>;
//   }

//   return <div style={{ background: "lightblue" }}>Old variant</div>;
// };

const Home = () => {
  return (
    <RolloutProvider clientKey="valid-sdk-key">
      <div>Lol</div>
    </RolloutProvider>
  );
};

export async function loader() {
  return null;
}

export default Home;
