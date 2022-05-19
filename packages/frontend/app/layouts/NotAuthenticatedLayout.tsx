import { Flex } from "@chakra-ui/react";
import { Container } from "~/components/Container";
import { Logo } from "~/components/Logo";
import { Main } from "~/components/Main";

export interface NotAuthenticatedLayoutProps {
  children: React.ReactNode;
  nav?: React.ReactNode;
  header: React.ReactNode;
}
export const NotAuthenticatedLayout = ({
  children,
  nav,
  header,
}: NotAuthenticatedLayoutProps) => {
  return (
    <Main>
      <Container>
        <Flex
          py={3}
          as={"nav"}
          aria-label="General"
          justifyContent={"space-between"}
          alignItems="center"
          h={"72px"}
        >
          <Logo to="/signin" />
        </Flex>

        {nav}

        {header}

        {children}
      </Container>
    </Main>
  );
};
