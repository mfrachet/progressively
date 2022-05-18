import { Box, Flex, Heading } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { Button } from "~/components/Button";
import { Typography } from "~/components/Typography";
import { Li, Ul } from "~/components/UL";
import { VisuallyHidden } from "~/components/VisuallyHidden";
import { ComparatorEnum, StrategyRetrieveDTO } from "../types";

export interface StrategyCardProps {
  flagId: string;
  projectId: string;
  envId: string;
  strat: StrategyRetrieveDTO;
  noBorder?: boolean;
}

const mapStrategyComparator = (comparatorEnum: ComparatorEnum) => {
  switch (comparatorEnum) {
    default:
    case ComparatorEnum.Equals: {
      return "equals";
    }

    case ComparatorEnum.NotEquals: {
      return "does not equal";
    }
  }
};

const StrategyAudience = ({ strat }: { strat: StrategyRetrieveDTO }) => {
  let targetedUsers = "all the people";
  let fieldName = undefined;

  if (strat.activationType === "percentage") {
    targetedUsers = `${strat.rolloutPercentage}% of the people`;
  }

  if (strat.strategyRuleType === "field") {
    fieldName = strat.fieldName;
  }

  return (
    <Typography color="textlight">
      Serve the flag to <strong>{targetedUsers}</strong>{" "}
      {fieldName ? (
        <span>
          with <strong>email</strong>{" "}
          <strong>
            {mapStrategyComparator(strat.fieldComparator as ComparatorEnum)}
          </strong>{" "}
          <span>to one of:</span>
        </span>
      ) : null}
    </Typography>
  );
};

const StrategyTargetConstraints = ({
  strat,
}: {
  strat: StrategyRetrieveDTO;
}) => {
  if (strat.strategyRuleType === "default") {
    return null;
  }

  if (strat.strategyRuleType === "field") {
    const targets = strat.fieldValue?.split("\n");

    return (
      <Box pl={8}>
        <Ul>
          {targets?.map((target) => (
            <Li key={target} color="textlight">
              {target}
            </Li>
          ))}
        </Ul>
      </Box>
    );
  }

  return null;
};

export const StrategyCard = ({
  flagId,
  projectId,
  envId,
  strat,
  noBorder,
}: StrategyCardProps) => {
  return (
    <Box
      pt={4}
      pb={4}
      pr={4}
      as="article"
      aria-labelledby={strat.uuid}
      borderTopWidth={noBorder ? 0 : 1}
      borderColor="background200"
      transition="background 0.3s"
      _focusWithin={{
        background: "background100",
      }}
    >
      <Flex
        alignItems={"flex-start"}
        justifyContent="space-between"
        direction={["column", "row"]}
      >
        <Box mr={4} pl={4}>
          <Heading as="h3" id={strat.uuid} size="md" mb={1}>
            {strat.name}
          </Heading>

          <StrategyAudience strat={strat} />
        </Box>

        <Button
          colorScheme="error"
          variant="outline"
          leftIcon={<FaTrash aria-hidden />}
          mt={[2, 0]}
          to={`/dashboard/projects/${projectId}/environments/${envId}/flags/${flagId}/strategies/${strat.uuid}/delete`}
        >
          Remove<VisuallyHidden> {strat.name}</VisuallyHidden>
        </Button>
      </Flex>

      <StrategyTargetConstraints strat={strat} />
    </Box>
  );
};
