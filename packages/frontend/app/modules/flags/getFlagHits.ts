import { Constants } from "~/constants";

export const getFlagHits = async (
  project: string,
  envId: string,
  flagId: string,
  accessToken: string
) =>
  fetch(
    `${Constants.BackendUrl}/environments/${envId}/flags/${flagId}/hits`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((res) => res.json());
