import { H1 } from "./H1";
import { Spacer } from "./Spacer";

export interface HeaderProps {
  title: string | React.ReactNode;
  description?: React.ReactNode;
  startAction?: React.ReactNode;
}

export const Header = ({ title, description, startAction }: HeaderProps) => {
  return (
    <div>
      <H1>{title}</H1>

      <Spacer size={4} />

      {description}

      {startAction}
    </div>
  );
};
