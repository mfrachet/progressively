import {
  Menu,
  MenuButton,
  Button,
  Icon,
  Box,
  Flex,
  VisuallyHidden,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "remix";
import { User } from "~/modules/user/types";
import { useHydrated } from "~/modules/misc/useHydrated";

export interface UserDropdownProps {
  user: User;
}

export const UseDropdown = ({ user }: UserDropdownProps) => {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return (
      <Button
        size="lg"
        as={Link}
        to="/profile"
        variant="ghost"
        paddingInlineEnd={[0, 4]}
        leftIcon={
          <Icon display={["none", "block"]} as={AiOutlineUser} aria-hidden />
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
      </Button>
    );
  }

  return (
    <Menu>
      <MenuButton
        size="lg"
        as={Button}
        variant="ghost"
        paddingInlineEnd={[0, 4]}
        leftIcon={
          <Icon display={["none", "block"]} as={AiOutlineUser} aria-hidden />
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
        <MenuItem as={Link} to="/profile" fontSize="xl">
          Profile
        </MenuItem>
        <MenuItem as={Link} to="/signout" fontSize="xl">
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
