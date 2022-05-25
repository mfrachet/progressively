import { ActionFunction, MetaFunction, useActionData } from "remix";
import { Header } from "~/components/Header";
import { Typography } from "~/components/Typography";
import { NotAuthenticatedLayout } from "~/layouts/NotAuthenticatedLayout";
import { AuthCredentials } from "~/modules/auth/types";
import {
  registerAction,
  RegisterForm,
} from "~/modules/user/components/RegisterForm";

export const meta: MetaFunction = () => {
  return {
    title: "Progressively | Welcome",
  };
};

interface ActionData {
  errors?: Partial<AuthCredentials & { badUser: string }>;
}

export const action: ActionFunction = ({
  request,
}): Promise<ActionData | Response> => {
  return registerAction({ request });
};

export default function WelcomePage() {
  const data = useActionData<ActionData>();
  const errors = data?.errors;

  return (
    <NotAuthenticatedLayout
      header={
        <Header
          title="Congratulations!"
          description={
            <Typography>
              {`You've`} successfully run your Progressively instance. {`It's`}{" "}
              time to create <strong>your admin user.</strong>
            </Typography>
          }
        />
      }
    >
      <RegisterForm errors={errors} />
    </NotAuthenticatedLayout>
  );
}
