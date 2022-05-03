import { ActionFunction, MetaFunction, Link } from "remix";
import { Main } from "~/components/Main";
import { Box, Link as CLink, HStack } from "@chakra-ui/react";
import { MdChevronLeft } from "react-icons/md";
import { H1 } from "~/components/H1";
import { Section } from "~/components/Section";
import { NotAuthenticatedLayout } from "~/layouts/NotAuthenticatedLayout";
import {
  RegisterForm,
  registerAction,
  RegisterActionData,
} from "~/modules/user/components/RegisterForm";

export const meta: MetaFunction = () => {
  return {
    title: "Progressively| Create an account",
  };
};

export const action: ActionFunction = ({
  request,
}): Promise<RegisterActionData> => {
  return registerAction({ request });
};

export default function CreateAccountPage() {
  return (
    <NotAuthenticatedLayout>
      <Main>
        <HStack mb={4}>
          <MdChevronLeft aria-hidden />
          <CLink as={Link} to="/signin">
            Back to signin
          </CLink>
        </HStack>

        <Section>
          <Box>
            <H1>Create an account</H1>
          </Box>

          <RegisterForm />
        </Section>
      </Main>
    </NotAuthenticatedLayout>
  );
}
