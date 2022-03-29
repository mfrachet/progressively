import {
  Box,
  Link as CLink,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { MdChevronLeft, MdPassword } from "react-icons/md";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  MetaFunction,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { Button } from "~/components/Button";
import { ErrorBox } from "~/components/ErrorBox";
import { Header } from "~/components/Header";
import { Main } from "~/components/Main";
import { Section, SectionHeader } from "~/components/Section";
import { SuccessBox } from "~/components/SuccessBox";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { authGuard } from "~/modules/auth/auth-guard";
import {
  validatePassword,
  validateConfirmationPassword,
} from "~/modules/forms/PasswordField/validatePassword";
import { changePassword } from "~/modules/user/changePassword";
import { User } from "~/modules/user/types";
import { getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return {
    title: "Rollout | Profile",
  };
};

interface ActionData {
  passwordUpdated?: boolean;
  errors?: {
    password?: string;
    confirmationPassword?: string;
    backendError?: string;
  };
}

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData> => {
  const formData = await request.formData();

  const password = formData.get("password")?.toString();
  const confirmationPassword = formData.get("confirmationPassword")?.toString();

  const passwordError = validatePassword(password);
  const confirmationPasswordError =
    validateConfirmationPassword(confirmationPassword);

  if (passwordError || confirmationPasswordError) {
    return {
      errors: {
        password: passwordError,
        confirmationPassword: confirmationPasswordError,
      },
    };
  }

  if (password !== confirmationPassword) {
    return {
      errors: {
        password: "The two passwords are not the same.",
      },
    };
  }

  const session = await getSession(request.headers.get("Cookie"));
  const authCookie = session.get("auth-cookie");
  await changePassword(password!, confirmationPassword!, authCookie);

  return { passwordUpdated: true };
};

interface LoaderData {
  user: User;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const user = await authGuard(request);

  return { user };
};

export default function ProfilePage() {
  const transition = useTransition();
  const data = useActionData<ActionData>();
  const { user } = useLoaderData<LoaderData>();
  const passwordUpdated = data?.passwordUpdated;
  const errors = data?.errors;

  return (
    <DashboardLayout user={user}>
      <Main>
        <HStack mb={4}>
          <MdChevronLeft aria-hidden />
          <CLink as={Link} to="/dashboard">
            Back to dashboard
          </CLink>
        </HStack>
        <Box pb={8}>
          <Header title="My profile" />
        </Box>

        <Section>
          <SectionHeader title="Change password" />

          <Box px={4} pb={4}>
            <Form method="post">
              <Stack spacing={4} mt={4}>
                {errors && Object.keys(errors).length > 0 && (
                  <ErrorBox list={errors} />
                )}

                {passwordUpdated && (
                  <SuccessBox id="password-changed">
                    The password has been successfully changed.
                  </SuccessBox>
                )}

                <FormControl isInvalid={Boolean(errors?.password)}>
                  <FormLabel htmlFor="password">New password</FormLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="**********"
                    aria-describedby={
                      errors?.password ? "error-password" : undefined
                    }
                  />
                </FormControl>

                <FormControl isInvalid={Boolean(errors?.confirmationPassword)}>
                  <FormLabel htmlFor="confirmationPassword">
                    Confirmation password
                  </FormLabel>
                  <Input
                    id="confirmationPassword"
                    name="confirmationPassword"
                    type="password"
                    placeholder="**********"
                    aria-describedby={
                      errors?.confirmationPassword
                        ? "error-confirmationPassword"
                        : undefined
                    }
                  />
                </FormControl>

                <Flex justifyContent="flex-end">
                  <Button
                    type="submit"
                    colorScheme={"brand"}
                    leftIcon={<MdPassword aria-hidden />}
                    isLoading={transition.state === "submitting"}
                    loadingText="Password changing in progress, please wait..."
                    disabled={false}
                  >
                    Change password
                  </Button>
                </Flex>
              </Stack>
            </Form>
          </Box>
        </Section>
      </Main>
    </DashboardLayout>
  );
}
