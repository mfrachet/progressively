import { Box, Text } from "@chakra-ui/react";
import {
  useActionData,
  ActionFunction,
  redirect,
  MetaFunction,
  useSearchParams,
} from "remix";
import { Header } from "~/components/Header";
import { Main } from "~/components/Main";
import { NotAuthenticatedLayout } from "~/layouts/NotAuthenticatedLayout";
import { AuthCredentials } from "~/modules/auth/types";
import { RegisterForm } from "~/modules/user/components/RegisterForm";
import { commitSession, getSession } from "~/sessions";
import { authenticate } from "../modules/auth/services/authenticate";
import { validateSigninForm } from "../modules/auth/validators/validate-signin-form";

export const meta: MetaFunction = () => {
  return {
    title: "Progressively | Welcome",
  };
};

interface ActionData {
  errors?: Partial<AuthCredentials & { badUser: string }>;
}

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData | Response> => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const errors = validateSigninForm({ email, password });

  if (errors?.email || errors?.password) {
    return { errors };
  }

  const res = await authenticate(email!, password!);

  const authenticationSucceed = await res.json();

  if (!authenticationSucceed.access_token || !res.headers.get("set-cookie")) {
    return {
      errors: {
        badUser: "Woops! Looks the credentials are not valid.",
      },
    };
  }

  session.set("auth-cookie", authenticationSucceed.access_token);
  session.set("refresh-token-cookie", res.headers.get("set-cookie"));

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function WelcomePage() {
  const [searchParams] = useSearchParams();
  const userActivated = searchParams.get("userActivated");
  const data = useActionData<ActionData>();

  return (
    <NotAuthenticatedLayout>
      <Main>
        <Box pb={4}>
          <Header
            title="Congratulations!"
            description={
              <Text textColor="textlight">
                {`You've`} successfully run your Progressively instance.{" "}
                {`It's`} time to create <strong>your admin user.</strong>
              </Text>
            }
          />
        </Box>

        <RegisterForm />
      </Main>
    </NotAuthenticatedLayout>
  );
}
