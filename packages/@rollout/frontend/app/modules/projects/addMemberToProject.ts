import { Constants } from "~/constants";

export const addMemberToProject = (memberEmail: string, accessToken: string) =>
  fetch(`${Constants.BackendUrl}/projects/members`, {
    method: "POST",
    body: JSON.stringify({ email: memberEmail }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(
        "You are not authorized to add a member to this project."
      );
    }

    return res.json();
  });
