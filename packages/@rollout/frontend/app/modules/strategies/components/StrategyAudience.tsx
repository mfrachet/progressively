import {
  Box,
  RadioGroup,
  Radio,
  FormControl,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { FormLabel } from "~/components/FormLabel";
import { Section, SectionHeader } from "~/components/Section";
import { StrategyCreateDTO } from "../types";
import { StrategyRuleType } from "../types/StrategyRule";

export interface StrategyAudienceProps {
  strategyType: StrategyRuleType;
  onStrategyChange: (nextStrategy: StrategyRuleType) => void;
  errors: Record<string, string>;
  initialFieldName?: StrategyCreateDTO["fieldName"];
  initialFieldValue?: StrategyCreateDTO["fieldValue"];
  initialFieldComparator?: StrategyCreateDTO["fieldComparator"];
}

export const StrategyAudience = ({
  strategyType,
  onStrategyChange,
  errors,
  initialFieldName,
  initialFieldValue,
  initialFieldComparator,
}: StrategyAudienceProps) => {
  return (
    <Section id="strategy-audience">
      <SectionHeader title="Strategy audience" />

      <RadioGroup
        value={strategyType}
        onChange={onStrategyChange}
        px={4}
        pb={4}
      >
        <Box>
          <Radio id="everybody" name="strategy-type" value="default">
            Everybody is concerned
          </Radio>
        </Box>

        <Box>
          <Radio id="field-name-radio" name="strategy-type" value="field">
            People with a specific field
          </Radio>
        </Box>

        <Box>
          <Radio name="strategy-type" value="pool">
            People belonging to a given group
          </Radio>
        </Box>
      </RadioGroup>

      {strategyType === "field" && (
        <Box mt={4}>
          <FormControl isInvalid={Boolean(errors["field-name"])}>
            <FormLabel htmlFor="field-name">Field name:</FormLabel>
            <Input
              type="text"
              name="field-name"
              id="field-name"
              placeholder="e.g: email"
              defaultValue={initialFieldName}
              aria-describedby={
                errors["field-name"] ? "error-field-name" : undefined
              }
            />
          </FormControl>

          <FormControl isInvalid={Boolean(errors["field-comparator"])}>
            <FormLabel htmlFor="field-comparator">Field comparator:</FormLabel>

            <Select
              name="field-comparator"
              id="field-comparator"
              defaultValue={initialFieldComparator}
              aria-describedby={
                errors["field-comparator"]
                  ? "error- field-comparator"
                  : undefined
              }
            >
              <option value="eq">Equals</option>
            </Select>
          </FormControl>

          <FormControl isInvalid={Boolean(errors["field-value"])}>
            <FormLabel htmlFor="field-value">
              Values matching the previous field (one per line):
            </FormLabel>
            <Textarea
              name="field-value"
              id="field-value"
              defaultValue={initialFieldValue}
              placeholder="e.g: marvin.frachet@gmail.com"
              aria-describedby={
                errors["field-value"] ? "error-field-value" : undefined
              }
            />
          </FormControl>
        </Box>
      )}
    </Section>
  );
};
