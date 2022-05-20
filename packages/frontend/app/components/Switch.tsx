/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLAttributes, useState } from "react";
import styled from "@emotion/styled";
import { Typography } from "./Typography";
import { Spinner } from "./Spinner";

const RawSwitch = styled.div`
  transition: all 0.3s;
  position: relative;

  &:before {
    transition: all 0.3s;
    position: absolute;
    width: ${({ theme }: any) => theme.sizes[6]};
    height: ${({ theme }: any) => theme.sizes[6]};
    border-radius: 50%;
    content: "";
    background: ${({ theme }: any) => theme.colors.white};
    transform: translateX(
      ${(props) => (props["data-is-checked"] ? "0%" : "-100%")}
    );
  }
`;

export interface SwitchProps extends HTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  type: "button" | "submit";
  optimistic?: boolean;
}

export const Switch = ({ checked, optimistic, ...props }: SwitchProps) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  return (
    <button
      role="switch"
      aria-label="Feature flag activation"
      aria-checked={checked}
      onClick={() => setInternalChecked((s) => !s)}
      {...props}
    >
      <Typography as="span">Off</Typography>
      <RawSwitch aria-hidden data-is-checked={internalChecked}>
        {optimistic && <Spinner />}
      </RawSwitch>
      <Typography as="span">On</Typography>
    </button>
  );
};
