import {
  Container,
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Box,
  VisuallyHidden,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Logo } from "~/components/Logo";
import { User } from "~/modules/user/types";

export interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}
export const DashboardLayout = ({ user, children }: DashboardLayoutProps) => {
  return (
    <div>
      <Container maxW="3xl">
        <Flex
          p={3}
          as={"nav"}
          aria-label="General navigation"
          justifyContent={"space-between"}
          alignItems="center"
          paddingEnd={0}
        >
          <Logo />

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              leftIcon={
                <Icon
                  display={["none", "block"]}
                  as={AiOutlineUser}
                  aria-hidden
                />
              }
            >
              <Box display={["none", "block"]} as="span">
                {user.fullname}
              </Box>

              <Flex
                display={["flex", "none"]}
                alignItems="center"
                justifyContent={"center"}
                as="span"
                borderRadius="50%"
                background="brand.300"
                h={"48px"}
                w={"48px"}
                color="white"
                fontSize={"xl"}
              >
                <span aria-hidden>{user.fullname.substring(0, 1)}</span>
                <VisuallyHidden>{user.fullname}</VisuallyHidden>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/profile">
                Profile
              </MenuItem>
              <MenuItem as={Link} to="/signout">
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>

      <Container maxW="3xl" pt={16} pb={4}>
        {children}
      </Container>
    </div>
  );
};
