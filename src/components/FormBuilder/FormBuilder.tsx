import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormBuilderFieldType, IFormBuilderStep } from './types';
import { Box } from '@mui/system';
import { FormBuilderStep } from './FormBuilderStep';

import { Skeleton } from '@mui/material';
import {
  IFormBuilderHeaderExportedProps,
  FormBuilderHeader,
} from './FormBuilderHeader';
import { debounce } from 'lodash';
import { types } from '@risefunds/sdk';

export interface IFormBuilderProps<Values> {
  id: string;
  disableSessionStore?: boolean;
  initialValues: Values;
  readOnly?: boolean;
  footerLeft?: React.FC<{ getValues: () => Values; setStepValues?: Function }>;
  footerRight?: React.FC<{ getValues: () => Values; setStepValues?: Function }>;
  headerRight?: React.ReactElement;
  fields: FormBuilderFieldType<Values>[];
  steps: IFormBuilderStep<Values>[];
  onSubmit?: (Values: Values) => Promise<void>;
  onCancel?: Function;
  onFinish?: (options?: { setSubmitLoading: (value: boolean) => void }) => void;
  loading?: boolean;
  FormBuilderHeaderProps?: IFormBuilderHeaderExportedProps;
  onChange?: (values: Values) => void;
}

export const FormBuilder = <Values extends types.IFormBuilderInitialValueType>({
  readOnly = false,
  loading = false,
  FormBuilderHeaderProps = {},
  onChange,
  ...props
}: IFormBuilderProps<Values>) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [values, setValues] = useState(props.initialValues);
  const debouncedChanged = useMemo(() => {
    return debounce((values) => {
      if (onChange) {
        onChange(values);
      }
    }, 1000);
  }, [onChange]);

  useEffect(() => {
    debouncedChanged(values);
  }, [debouncedChanged, values]);

  const updateValues = useCallback((stepValues: any) => {
    setValues((latestValues) => ({ ...latestValues, ...stepValues }));
  }, []);

  const onStepChange = useCallback(
    (updatedStepValues: any) => {
      updateValues(updatedStepValues);
    },
    [updateValues],
  );

  const getValues = useCallback(() => {
    return values;
  }, [values]);

  let steps = useMemo(() => {
    return props.steps.filter((step) => {
      if (typeof step.skip === 'undefined') {
        return true;
      }

      if (step.skip?.(getValues())) {
        return false;
      }
      return true;
    });
  }, [props.steps, getValues]);

  const activeStep = useMemo(
    () => steps[activeStepIndex],
    [activeStepIndex, steps],
  );

  if (!activeStep) {
    return <></>;
  }

  if (loading) {
    return <Skeleton />;
  }

  const setActiveStep = (step: IFormBuilderStep<any>) => {
    const updatedActiveStepIndex = steps.findIndex((s) => s.id === step.id);
    setActiveStepIndex(updatedActiveStepIndex);
  };

  return (
    <Box style={{ position: 'relative' }} width="100%">
      {steps.map((step, idx) => {
        if (
          !readOnly &&
          step.id !== activeStep.id &&
          activeStep.id !== 'review'
        ) {
          return (
            <React.Fragment
              key={`formBuilder-${props.id}-${step.id}`}
            ></React.Fragment>
          );
        }

        return (
          <React.Fragment key={`formBuilder-${props.id}-${step.id}`}>
            <FormBuilderHeader
              steps={steps}
              activeStep={readOnly ? step : activeStep}
              setActiveStep={setActiveStep}
              {...FormBuilderHeaderProps}
            />

            <FormBuilderStep
              isSubmitDefined={props.onSubmit ? true : false}
              onChange={onStepChange}
              step={step}
              fields={
                (step.fields?.map((fieldId) => {
                  return props.fields.find((f) => f.id === fieldId);
                }) ?? []) as FormBuilderFieldType<any>[]
              }
              getValues={getValues}
              setValues={async (stepValues: any) => {
                try {
                  updateValues(stepValues);
                  setActiveStepIndex(activeStepIndex + 1);
                } catch (error) {}
              }}
              steps={steps}
              onSubmit={
                !steps.find((step) => step.id === 'review') &&
                idx === steps.length - 1
                  ? async (updatedStepValues) => {
                      if (props.onSubmit) {
                        await props.onSubmit({
                          ...values,
                          ...updatedStepValues,
                        });
                      }
                    }
                  : undefined
              }
              setActiveStep={setActiveStep}
              readOnly={readOnly}
              onCancel={props.onCancel}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
};
