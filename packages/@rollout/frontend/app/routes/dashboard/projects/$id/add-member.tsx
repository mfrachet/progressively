import {
  Box,
  FormControl,
  Input,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { IoIosCreate } from "react-icons/io";
import {
  Form,
  useActionData,
  ActionFunction,
  redirect,
  MetaFunction,
  LoaderFunction,
  useLoaderData,
  useTransition,
} from "remix";
import { Crumbs, BreadCrumbs } from "~/components/AppBreadcrumbs";
import { ErrorBox } from "~/components/ErrorBox";
import { authGuard } from "~/modules/auth/auth-guard";
import { Project, UserProject, UserRoles } from "~/modules/projects/types";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { getSession } from "~/sessions";
import { User } from "~/modules/user/types";
import { Header } from "~/components/Header";
import { Section } from "~/components/Section";
import { Button } from "~/components/Button";
import { FormLabel } from "~/components/FormLabel";
import { validateEmail } from "~/modules/forms/EmailField/validateEmail";
import { getProject } from "~/modules/projects/getProject";
import { MdOutlineEmail } from "react-icons/md";
import { ButtonCopy } from "~/components/ButtonCopy";

interface MetaArgs {
  data: {
    project: Project;
  };
}

export const meta: MetaFunction = ({ data }: MetaArgs) => {
  const project = data.project;

  return {
    title: `Rollout | ${project.name} | Add member`,
  };
};

interface LoaderData {
  project: Project;
  adminOfProject: Array<User>;
  userRole?: UserRoles;
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

  const adminOfProject = (project?.userProject || [])
    ?.filter((up) => up.role === UserRoles.Admin)
    .map((up) => up.user) as Array<User>;

  return { user, project, userRole: userProject?.role, adminOfProject };
};

interface ActionData {
  errors: Partial<{ email: string }>;
}

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData | Response> => {
  const formData = await request.formData();
  const memberEmail = formData.get("member-email")?.toString();

  const emailError = validateEmail(memberEmail);

  if (emailError) {
    return { errors: { email: emailError } };
  }

  return redirect("/");

  //   const session = await getSession(request.headers.get("Cookie"));

  //   const userProject: UserProject = await createProject(
  //     projectName!,
  //     session.get("auth-cookie")
  //   );

  //   return redirect(
  //     `/dashboard?newProjectId=${userProject.projectId}#project-added`
  //   );
};

export default function CreateProjectPage() {
  const data = useActionData<ActionData>();
  const transition = useTransition();
  const { project, userRole, adminOfProject, user } =
    useLoaderData<LoaderData>();
  const errors = data?.errors;

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
      link: `/dashboard/projects/${project.uuid}/add-member`,
      label: "Add member",
    },
  ];

  if (userRole !== UserRoles.Admin) {
    return (
      <DashboardLayout
        user={user}
        breadcrumb={<BreadCrumbs crumbs={crumbs} />}
        header={
          <Header title="You are not allowed to add members to projects." />
        }
      >
        <Section>
          <figure>
            <Text as="figcaption">
              If you think this is an error, make sure to contact one of the
              project administrators:
            </Text>

            <UnorderedList pl={2} mt={2}>
              {adminOfProject.map((user) => (
                <ListItem key={user.uuid}>
                  <Text as="span" mr={2}>
                    {user.fullname}
                  </Text>
                  <ButtonCopy
                    toCopy={user.email}
                    icon={<MdOutlineEmail aria-hidden />}
                  >
                    {user.email}
                  </ButtonCopy>
                </ListItem>
              ))}
            </UnorderedList>
          </figure>
        </Section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={user}
      breadcrumb={<BreadCrumbs crumbs={crumbs} />}
      header={<Header title="Add member" />}
    >
      <Section>
        {errors?.email && (
          <Box pb={4}>
            <ErrorBox list={errors} />
          </Box>
        )}
        <Form method="post">
          <FormControl isInvalid={Boolean(errors?.email)}>
            <FormLabel htmlFor="member-email">Member email</FormLabel>
            <Input
              type="text"
              name="member-email"
              id="member-email"
              placeholder="e.g: john.doe@gmail.com"
              aria-describedby={errors?.email ? `error-email` : undefined}
            />
          </FormControl>

          <Box mt={4}>
            <Button
              type="submit"
              leftIcon={<IoIosCreate aria-hidden />}
              colorScheme="brand"
              isLoading={transition.state === "submitting"}
              loadingText="Adding the member, please wait..."
              disabled={false}
            >
              Add the member
            </Button>
          </Box>
        </Form>
      </Section>
    </DashboardLayout>
  );
}
