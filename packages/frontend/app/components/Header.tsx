import { styled } from "~/stitches.config";
import { H1 } from "./H1";
import { Spacer } from "./Spacer";

const HeaderWrapper = styled("div", {
  textAlign: "center",
});

export interface HeaderProps {
  title: string | React.ReactNode;
  description?: React.ReactNode;
  startAction?: React.ReactNode;
}

export const Header = ({ title, description, startAction }: HeaderProps) => {
  return (
    <HeaderWrapper>
      <H1>{title}</H1>

      <Spacer size={4} />

      {description}

      {startAction}
    </HeaderWrapper>
  );
};
