import { useState } from "react";
import { RadioField } from "~/components/Fields/RadioField";
import { SliderInput } from "~/components/Fields/SliderInput";
import { ActivationType } from "../types/activation";

export interface ActivationStrategyProps {
  activationStrategy: ActivationType;
  onActivationChange: (nextActionvation: ActivationType) => void;
}

export const ActivationStrategy = ({
  activationStrategy,
  onActivationChange,
}: ActivationStrategyProps) => {
  const [percentageValue, setPercentageValue] = useState<number>(50);

  return (
    <div>
      <RadioField<ActivationType>
        title="Activation strategy"
        value={activationStrategy}
        onChange={onActivationChange}
        name="strategy-activation"
        options={[
          { value: "boolean", label: "Everyone will see the variants" },
          { value: "percentage", label: "A percentage of the audience" },
        ]}
      />

      {activationStrategy === "percentage" && (
        <SliderInput
          name="percentage-value"
          label={`Percentage of the people concerned (${percentageValue}
            %):`}
          onChange={setPercentageValue}
          percentageValue={percentageValue}
        />
      )}
    </div>
  );
};
