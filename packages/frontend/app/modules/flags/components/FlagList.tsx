import { FlagEnv } from "../types";
import { FlagCard } from "./FlagCard";

export interface FlagListProps {
  flags: Array<FlagEnv>;
  projectId: string;
  envId: string;
}

export const FlagList = ({ flags, projectId, envId }: FlagListProps) => {
  return (
    <div>
      {flags.map((flagEnv) => (
        <FlagCard
          key={flagEnv.flagId}
          id={flagEnv.flagId}
          linkTo={`/dashboard/projects/${projectId}/environments/${envId}/flags/${flagEnv.flagId}`}
          title={flagEnv.flag.name}
          flagStatus={flagEnv.status}
          flagKey={flagEnv.flag.key}
          description={flagEnv.flag.description}
        />
      ))}
    </div>
  );
};
