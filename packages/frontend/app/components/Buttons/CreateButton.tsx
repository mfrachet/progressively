import { Button, ButtonProps } from "./Button";

export const CreateButton = ({ children, ...props }: ButtonProps) => {
  return <Button {...props}>{children}</Button>;
};
