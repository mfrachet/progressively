import { Flex, Icon } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Li, Ul } from "./Ul";

export interface ErrorBoxProps {
  list: {
    [key: string]: string;
  };
}

export const ErrorBox = ({ list }: ErrorBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const errors = Object.keys(list);

  useEffect(() => {
    boxRef?.current?.focus();
  }, []);

  const label =
    errors.length === 1
      ? `The following error has been found:`
      : `The following ${errors.length} errors have been found:`;

  return (
    <figure ref={boxRef} tabIndex={-1} className="error-box">
      <Flex as="figcaption">
        <Icon as={MdErrorOutline} w={6} h={6} aria-hidden mr={2} />
        <strong>{label}</strong>
      </Flex>

      <Ul>
        {errors.map((errorKey) => (
          <Li key={`error-${errorKey}`} id={`error-${errorKey}`}>
            {list[errorKey]}
          </Li>
        ))}
      </Ul>
    </figure>
  );
};
