import React from "react";
import { RolloutProvider, getSSRProps, useFlags } from "@rollout/react";

const FlaggedComponent = () => {
  const { flags } = useFlags();

  if (flags.newHomepage) {
    return <div style={{ background: "red", color: "white" }}>New variant</div>;
  }

  return <div style={{ background: "lightblue" }}>Old variant</div>;
};

export async function loader() {
  const ssrProps = await getSSRProps("valid-sdk-key", {
    fields: {
      email: "marvin.frachet@gmail.com",
      id: "1",
    },
  });

  return ssrProps;
}

const Home = ({ rolloutProps }: any) => {
  return (
    <RolloutProvider {...rolloutProps}>
      <main>
        <FlaggedComponent />
      </main>
    </RolloutProvider>
  );
};

export default Home;
