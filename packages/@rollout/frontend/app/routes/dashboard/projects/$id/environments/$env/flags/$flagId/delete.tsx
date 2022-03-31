import { Box, Text, Flex, VisuallyHidden } from "@chakra-ui/react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { Crumbs, BreadCrumbs } from "~/components/AppBreadcrumbs";
import { ErrorBox } from "~/components/ErrorBox";
import { FaTrash } from "react-icons/fa";
import { WarningBox } from "~/components/WarningBox";
import { authGuard } from "~/modules/auth/auth-guard";
import { Environment } from "~/modules/environments/types";
import { getProject } from "~/modules/projects/getProject";
import { Project } from "~/modules/projects/types";
import { User } from "~/modules/user/types";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { getSession } from "~/sessions";
import { Header } from "~/components/Header";
import { Section } from "~/components/Section";
import { FlagEnv } from "~/modules/flags/types";
import { getFlagsByProjectEnv } from "~/modules/flags/getFlagsByProjectEnv";
import { deleteFlag } from "~/modules/flags/deleteFlag";
import { Button } from "~/components/Button";

interface MetaArgs {
  data: {
    project: Project;
    environment: Environment;
    currentFlagEnv: FlagEnv;
  };
}

export const meta: MetaFunction = ({ data }: MetaArgs) => {
  const project = data.project;
  const environment = data.environment;
  const currentFlagEnv = data.currentFlagEnv;
  const { flag } = currentFlagEnv;

  return {
    title: `Rollout | ${project.name} | ${environment.name} | ${flag.name} | Delete`,
  };
};

interface LoaderData {
  project: Project;
  environment: Environment;
  user: User;
  currentFlagEnv: FlagEnv;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const user = await authGuard(request);
  const session = await getSession(request.headers.get("Cookie"));
  const authCookie = session.get("auth-cookie");

  const project: Project = await getProject(
    params.id!,
    session.get("auth-cookie"),
    true
  );

  const flagsByEnv: Array<FlagEnv> = await getFlagsByProjectEnv(
    params.id!,
    params.env!,
    authCookie
  );

  const environment = project.environments.find(
    (env) => env.uuid === params.env
  );

  const currentFlagEnv = flagsByEnv.find(
    (flagEnv) => flagEnv.flagId === params.flagId!
  )!;

  return {
    project,
    environment: environment!,
    user,
    currentFlagEnv,
  };
};

interface ActionData {
  errors?: {
    backendError?: string;
  };
}

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<ActionData | Response> => {
  const session = await getSession(request.headers.get("Cookie"));
  const projectId = params.id!;
  const envId = params.env!;
  const flagId = params.flagId!;

  try {
    await deleteFlag(projectId, envId, flagId, session.get("auth-cookie"));
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { errors: { backendError: e.message } };
    }

    return { errors: { backendError: "An error ocurred" } };
  }

  return redirect(
    `/dashboard/projects/${projectId}/environments/${envId}/flags?flagRemoved=true#flag-removed`
  );
};

export default function DeleteFlagPage() {
  const transition = useTransition();

  const { project, environment, user, currentFlagEnv } =
    useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();

  const currentFlag = currentFlagEnv.flag;

  const crumbs: Crumbs = [
    {
      link: "/dashboard",
      label: "Projects",
    },
    {
      link: `/dashboard/projects/${project.uuid}`,
      label: project.name,
    },
    {
      link: `/dashboard/projects/${project.uuid}/environments/${environment.uuid}/flags`,
      label: environment.name,
    },
    {
      link: `/dashboard/projects/${project.uuid}/environments/${environment.uuid}/flags/${currentFlag.uuid}`,
      label: currentFlag.name,
    },
  ];

  const warnings = {
    "turned-off": "All your feature flags will be turned off and removed",
    "stats-deleted": "All the stats related to the flag will be removed",
  };

  return (
    <DashboardLayout
      user={user}
      breadcrumb={<BreadCrumbs crumbs={crumbs} />}
      header={<Header title="You are about to delete the feature flag." />}
    >
      <Section>
        {data?.errors && data.errors.backendError && (
          <Box pb={4}>
            <ErrorBox list={data.errors} />
          </Box>
        )}

        <WarningBox
          list={warnings}
          title={
            <Text>
              We really want to warn you: if you validate the flag suppression,
              you {`won't`} be able to access the{" "}
              <strong>{currentFlag.name}</strong> flag anymore. It includes:
            </Text>
          }
        />

        <Flex
          justifyContent="space-between"
          mt={4}
          direction={["column", "row"]}
        >
          <Button
            to={`/dashboard/projects/${project.uuid}/environments/${environment.uuid}/flags/${currentFlag.uuid}/settings`}
            variant="outline"
            colorScheme="error"
            mt={[4, 0]}
          >
            <span>
              No, {`don't`} delete{" "}
              <Box as="strong" display={["none", "inline"]} aria-hidden>
                {currentFlag.name}
              </Box>
              <VisuallyHidden>{currentFlag.name}</VisuallyHidden>
            </span>
          </Button>

          <Form method="post">
            <Button
              type="submit"
              colorScheme="error"
              leftIcon={<FaTrash aria-hidden />}
              isLoading={transition.state === "submitting"}
              loadingText="Deleting the environment, please wait..."
              disabled={false}
            >
              Yes, delete the flag
            </Button>
          </Form>
        </Flex>
      </Section>
    </DashboardLayout>
  );
}
