import {
  ActionFunction,
  Form,
  MetaFunction,
  useActionData,
  useTransition,
} from "remix";
import { BackLink } from "~/components/BackLink";
import { SubmitButton } from "~/components/Buttons/SubmitButton";
import { ErrorBox } from "~/components/ErrorBox";
import { FormGroup } from "~/components/Fields/FormGroup";
import { TextInput } from "~/components/Fields/TextInput";
import { Header } from "~/components/Header";
import { SuccessBox } from "~/components/SuccessBox";
import { Typography } from "~/components/Typography";
import { NotAuthenticatedLayout } from "~/layouts/NotAuthenticatedLayout";
import { validateEmail } from "~/modules/forms/utils/validateEmail";
import { forgotPassword } from "~/modules/user/services/forgotPassword";

export const meta: MetaFunction = () => {
  return {
    title: "Progressively | Password forgotten",
  };
};

interface ActionData {
  success?: boolean;
  errors?: { email?: string; backendError?: string };
}

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData> => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();

  const emailError = validateEmail(email);

  if (emailError) {
    return {
      errors: {
        email: emailError,
      },
    };
  }

  try {
    await forgotPassword(email!);

    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          backendError: err.message,
        },
      };
    }

    return { errors: { backendError: "An error ocurred" } };
  }
};

export default function ForgotPasswordPage() {
  const data = useActionData<ActionData>();
  const transition = useTransition();
  const success = data?.success;
  const errors = data?.errors;

  return (
    <NotAuthenticatedLayout
      nav={<BackLink to="/signin">Back to signin</BackLink>}
      header={
        <Header
          title="Password forgotten"
          description={
            <Typography>
              Enter your email to get a recovery link and reset your password.
            </Typography>
          }
        />
      }
      status={
        <>
          {errors && Object.keys(errors).length > 0 && (
            <ErrorBox list={errors} />
          )}

          {success && (
            <SuccessBox id="password-reset">
              An email with a link to reset your password has been set. Make
              sure to follow the instructions.
            </SuccessBox>
          )}
        </>
      }
    >
      <Form method="post">
        <FormGroup>
          <TextInput
            isInvalid={Boolean(errors?.email)}
            label="Email"
            name="email"
            type="email"
            placeholder="e.g: james.bond@mi6.com"
          />

          <SubmitButton
            isLoading={transition.state === "submitting"}
            loadingText="Password resetting in progress, please wait..."
          >
            Reset password
          </SubmitButton>
        </FormGroup>
      </Form>
    </NotAuthenticatedLayout>
  );
}
