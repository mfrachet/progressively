import { Container } from "~/components/Container";
import { Logo } from "~/components/Logo";
import { Main } from "~/components/Main";
import { Nav } from "~/components/Nav";
import { Stack } from "~/components/Stack";

export interface NotAuthenticatedLayoutProps {
  children: React.ReactNode;
  nav?: React.ReactNode;
  header: React.ReactNode;
  status?: React.ReactNode;
}
export const NotAuthenticatedLayout = ({
  children,
  nav,
  header,
  status,
}: NotAuthenticatedLayoutProps) => {
  return (
    <div>
      <Nav aria-label="General">
        <Logo to="/signin" />
      </Nav>

      <Main>
        <Container>
          {nav}

          {header}

          {status && <Stack spacing={4}>{status}</Stack>}

          {children}
        </Container>
      </Main>
    </div>
  );
};
