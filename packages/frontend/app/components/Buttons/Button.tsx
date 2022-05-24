import { HTMLAttributes } from "react";
import { styled } from "~/stitches.config";
import { Link } from "../Link";

const RawButton = styled("button", {
  background: "$background",
  borderRadius: "$borderRadius$regular",
  padding: "$spacing$3 $spacing$4",
  color: "$title",
  fontSize: "$btn",
  fontFamily: "$default",
  border: "2px solid $primary",
  display: "inline-block",
  textDecoration: "none",
  cursor: "pointer",
});

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  to?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  to,
  children,
  type,
  isLoading,
  loadingText,
  ...props
}: ButtonProps) => {
  if (to) {
    return (
      <RawButton as={Link} to={to}>
        {children}
      </RawButton>
    );
  }

  return (
    <RawButton type={type} {...props}>
      {children}
    </RawButton>
  );
};
