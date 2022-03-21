import { Box, Button, Stack, Text, VisuallyHidden } from "@chakra-ui/react";
import { AiOutlineSetting } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";
import {
  ActionFunction,
  Link,
  LoaderFunction,
  MetaFunction,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { Crumbs, BreadCrumbs } from "~/components/AppBreadcrumbs";
import { ErrorBox } from "~/components/ErrorBox";
import { Header } from "~/components/Header";
import { HorizontalNav, NavItem } from "~/components/HorizontalNav";
import { Main } from "~/components/Main";
import { Section, SectionHeader } from "~/components/Section";
import { SuccessBox } from "~/components/SuccessBox";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { authGuard } from "~/modules/auth/auth-guard";
import { getProject } from "~/modules/projects/getProject";
import { removeMember } from "~/modules/projects/removeMember";
import { Project, UserProject, UserRoles } from "~/modules/projects/types";
import { User } from "~/modules/user/types";
import { UserTable } from "~/modules/user/UserTable";
import { getSession } from "~/sessions";

export const meta: MetaFunction = ({ data }) => {
  const { project }: { project: Project } = data;

  return {
    title: `Rollout | ${project.name} | Settings`,
  };
};

interface LoaderData {
  project: Project;
  userRole: string | undefined;
  user: User;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const user = await authGuard(request);
  const session = await getSession(request.headers.get("Cookie"));
  const project: Project = await getProject(
    params.id!,
    session.get("auth-cookie"),
    true
  );

  const userProject: UserProject | undefined = project.userProject?.find(
    (userProject) => userProject.userId === user.uuid
  );

  return { project, userRole: userProject?.role, user };
};

interface ActionData {
  errors: { unauthorized?: string };
  success?: boolean;
  removedCount?: number;
}

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<ActionData | null> => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const method = formData.get("_method");

  if (method === "delete-member") {
    const promiseOfMembersToRemove: Array<Promise<{ statusCode: number }>> = [];

    formData.forEach((d) => {
      if (d !== "delete-member" && d !== "select-all") {
        promiseOfMembersToRemove.push(
          removeMember(params.id!, d.toString(), session.get("auth-cookie"))
        );
      }
    });

    const result = await Promise.all(promiseOfMembersToRemove);
    const successful = result.filter((res) => res?.statusCode !== 401);

    return {
      errors: {
        unauthorized:
          successful.length !== result.length
            ? "You have attempted to remove an admin user! No worries, we got your back!"
            : undefined,
      },
      success: successful.length > 0,
      removedCount: successful.length,
    };
  }

  return null;
};

export default function SettingsPage() {
  const { project, userRole, user } = useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();
  const transition = useTransition();

  const crumbs: Crumbs = [
    {
      link: "/dashboard",
      label: "Projects",
    },
    {
      link: `/dashboard/projects/${project.uuid}`,
      label: project.name,
    },
  ];

  return (
    <DashboardLayout user={user}>
      <BreadCrumbs crumbs={crumbs} />

      <Main>
        <Box pb={8}>
          <Header
            title={
              <span>
                {project.name}
                <VisuallyHidden> settings</VisuallyHidden>
              </span>
            }
          />
        </Box>

        <Box pb={6}>
          <HorizontalNav label={`Project related navigation`}>
            <NavItem
              to={`/dashboard/projects/${project.uuid}`}
              icon={<FiLayers />}
            >
              Environments
            </NavItem>

            <NavItem
              to={`/dashboard/projects/${project.uuid}/settings`}
              icon={<AiOutlineSetting />}
            >
              Settings
            </NavItem>
          </HorizontalNav>
        </Box>

        <Stack spacing={4}>
          <Section as="section" id="details">
            <SectionHeader title="Project details" />

            <Box px={4}>{project.name}</Box>
          </Section>

          <Section as="section" id="members">
            <SectionHeader
              title="Project members"
              description={
                <Text>
                  Remember that users with the role <em>Admin</em> {`can't`} be
                  removed.
                </Text>
              }
            />

            {data?.errors.unauthorized && (
              <Box mb={2}>
                <ErrorBox list={data.errors} />
              </Box>
            )}
            {data?.success && (
              <Box mb={2}>
                <SuccessBox id="member-deleted">
                  {data?.removedCount} user have been successfully removed from
                  the project.
                </SuccessBox>
              </Box>
            )}

            <Box mt={4}>
              <UserTable
                userProjects={project.userProject || []}
                labelledBy="members"
                canEdit={userRole === UserRoles.Admin}
              />
            </Box>

            <Text aria-live="polite" mt={4}>
              {transition.state === "submitting" ? "Removing the users..." : ""}
            </Text>
          </Section>

          {userRole === UserRoles.Admin && (
            <Section as="section" id="danger">
              <SectionHeader
                title="Danger zone"
                description={
                  <Text>
                    You can delete a project at any time, but you {`won’t`} be
                    able to access its environments and all the related flags
                    will be removed and be falsy in your applications. Be sure
                    to know what {`you're`} doing before removing a project.
                  </Text>
                }
              />

              <Box px={4} pb={4}>
                <Button
                  as={Link}
                  colorScheme="error"
                  to={`/dashboard/projects/${project.uuid}/delete`}
                  leftIcon={<FaTrash aria-hidden />}
                  variant="outline"
                >
                  Delete{" "}
                  <Box as="span" aria-hidden display={["none", "inline"]}>
                    {`"${project.name}"`} forever
                  </Box>
                  <VisuallyHidden>{`"${project.name}"`} forever</VisuallyHidden>
                </Button>
              </Box>
            </Section>
          )}
        </Stack>
      </Main>
    </DashboardLayout>
  );
}
