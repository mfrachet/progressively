import { ButtonProps } from "@chakra-ui/react";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHydrated } from "~/modules/misc/useHydrated";
import { Button } from "./Button";

export interface ButtonCopyProps extends ButtonProps {
  toCopy: string;
  icon: React.ReactElement<unknown>;
  children: React.ReactNode;
}

export const ButtonCopy = ({
  toCopy,
  children,
  icon,
  colorScheme,
  ...props
}: ButtonCopyProps) => {
  const timerIdRef = useRef<NodeJS.Timeout>();
  const [isCopied, setIsCopied] = useState(false);
  const isHydrated = useHydrated();

  useEffect(() => {
    if (isCopied) {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }

      timerIdRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }

    const timerId = timerIdRef.current;

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isCopied]);

  if (isHydrated) {
    const copyToClipBoardProps = props as HTMLAttributes<HTMLButtonElement>;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsCopied(true);
    };

    return (
      <CopyToClipboard text={toCopy}>
        <Button
          variant="outline"
          leftIcon={icon}
          onClick={handleClick}
          colorScheme={colorScheme}
          aria-live="polite"
          {...copyToClipBoardProps}
        >
          {isCopied ? "Copied" : children}
        </Button>
      </CopyToClipboard>
    );
  }

  const spanProps = props as HTMLAttributes<HTMLSpanElement>;

  return (
    <Button
      as="span"
      size={"lg"}
      variant="outline"
      leftIcon={icon}
      onClick={undefined}
      colorScheme={colorScheme}
      aria-live="polite"
      {...spanProps}
    >
      {children}
    </Button>
  );
};
