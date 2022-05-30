import { Link as RLink } from "remix";
import { forwardRef, HTMLAttributes } from "react";
import { styled } from "~/stitches.config";

const RawLink = styled("a", {
  display: "flex",
  fontSize: "$content",
  color: "$content",
  fontFamily: "$default",
  height: "$cta",
  alignItems: "center",
});

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}
export const Link = forwardRef(
  ({ to, children, ...props }: LinkProps, ref: any) => {
    return (
      <div>
        <RawLink as={RLink} ref={ref} to={to} {...props}>
          {children}
        </RawLink>
      </div>
    );
  }
);

Link.displayName = "Link";
