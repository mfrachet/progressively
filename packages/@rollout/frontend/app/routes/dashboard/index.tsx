import { Box, Stack } from "@chakra-ui/react";
import {
  useLoaderData,
  LoaderFunction,
  MetaFunction,
  redirect,
  useSearchParams,
} from "remix";
import { IoIosCreate } from "react-icons/io";
import { SuccessBox } from "~/components/SuccessBox";
import { getProjects } from "~/modules/projects/getProjects";
import { UserProject } from "~/modules/projects/types";
import { getSession } from "~/sessions";
import { ProjectCard } from "~/modules/projects/ProjectCard";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { authGuard } from "~/modules/auth/auth-guard";
import { User } from "~/modules/user/types";
import { Header } from "~/components/Header";
import { Section } from "~/components/Section";
import { Button } from "~/components/Button";

export const meta: MetaFunction = () => {
  return {
    title: "Rollout | Projects list",
  };
};

interface LoaderData {
  user: User;
  projects: Array<UserProject>;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const user = await authGuard(request);

  const session = await getSession(request.headers.get("Cookie"));
  const authCookie = session.get("auth-cookie");

  const projects = await getProjects(authCookie);

  if (projects.length === 0) {
    return redirect("/dashboard/onboarding");
  }

  return { projects, user };
};

export default function DashboardRoot() {
  const [searchParams] = useSearchParams();
  const { projects, user } = useLoaderData<LoaderData>();

  const newProjectId = searchParams.get("newProjectId") || undefined;
  const hasRemovedProject = searchParams.get("projectRemoved") || undefined;

  return (
    <DashboardLayout
      user={user}
      header={
        <Header
          title="Projects"
          startAction={
            <Button
              leftIcon={<IoIosCreate aria-hidden />}
              to="/dashboard/projects/create"
              colorScheme="brand"
              width={["100%", "auto"]}
            >
              Create a project
            </Button>
          }
        />
      }
    >
      <Section>
        <Stack spacing={2}>
          {newProjectId ? (
            <SuccessBox id="project-added">
              The project has been successfully created.
            </SuccessBox>
          ) : null}

          {hasRemovedProject ? (
            <SuccessBox id="project-removed">
              The project has been successfully removed.
            </SuccessBox>
          ) : null}

          <Box>
            {projects.map((project, index: number) => (
              <ProjectCard
                key={project.projectId}
                id={project.projectId}
                linkTo={`/dashboard/projects/${project.projectId}`}
                title={project.project.name}
                noBorder={index === 0}
                description={
                  <>
                    You are an <em>{project.role}</em> of the project.
                  </>
                }
              />
            ))}
          </Box>
        </Stack>
      </Section>
    </DashboardLayout>
  );
}
