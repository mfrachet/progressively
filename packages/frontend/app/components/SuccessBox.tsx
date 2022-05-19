import { useEffect, useRef } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

export interface SuccessBoxProps extends FlexProps {
  children: React.ReactNode;
  id: string;
}

export const SuccessBox = ({ children, id, ...props }: SuccessBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef?.current?.focus();
  }, []);

  return (
    <p ref={boxRef} tabIndex={-1} id={id} {...props}>
      <AiOutlineCheckCircle aria-hidden />
      {children}
    </p>
  );
};
