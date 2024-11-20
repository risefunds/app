import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactElement,
  memo,
} from 'react';
import { List, Typography, ListItem, Icon, Grid, Box } from '@mui/material';
import { IFormBuilderStep, FormBuilderFieldType } from './types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import FormBuilderStepField from './FormBuilderStepField';
import FormBuilderFooter from './FormBuilderFooter';
import { debounce } from 'lodash';

interface IFormBuilderStepProps {
  steps: IFormBuilderStep<any>[];
  step: IFormBuilderStep<any>;
  fields: FormBuilderFieldType<any>[];
  readOnly?: boolean;
  getValues: Function;
  setValues?: (values: any) => Promise<void>;

  disableForm?: boolean;
  onChange: (values: any) => void;

  onSubmit?: (Values: any) => Promise<void>;
  onCancel?: Function;
  setActiveStep: (updatedStep: IFormBuilderStep<any>) => void;
  isSubmitDefined: boolean;
}

const FormBuilderStepWOMemo: React.FC<IFormBuilderStepProps> = ({
  readOnly = false,
  disableForm = false,
  onChange,
  fields,
  getValues,
  ...props
}: IFormBuilderStepProps) => {
  const getValidationSchema = useCallback(
    (values: any) => {
      return (
        fields.reduce((previoudValidation, field) => {
          if (field?.validationSchema) {
            if (field.skip) {
              if (field.skip({ ...getValues(), ...values })) {
                return previoudValidation;
              }
            }

            if (field.multiple) {
              return {
                ...previoudValidation,
                [field.id]: yup.array().of(field?.validationSchema),
              };
            } else {
              return (previoudValidation = {
                ...previoudValidation,
                [field.id]: field?.validationSchema,
              });
            }
          }
          return previoudValidation;
        }, {}) || {}
      );
    },
    [fields, getValues]
  );
  const formik = useFormik({
    initialValues:
      fields.reduce((final, field) => {
        return field ? { ...final, [field.id]: getValues()[field.id] } : final;
      }, {}) || {},
    isInitialValid: true,
    onSubmit: async (values) => {
      try {
        if (props.onSubmit) return await props.onSubmit(values);
        if (props.setValues) await props.setValues(values);
      } catch (error: any) {
        // console.log(error.message)
      }
    },
    validationSchema: () =>
      yup.lazy((values: any) => {
        const schema = getValidationSchema(values);
        return yup.object().shape<any>(schema);
      }),
  });

  const getStepValues = useCallback(() => {
    return { ...getValues(), ...formik.values };
  }, [formik.values, getValues]);

  useEffect(() => {
    const debouncedChange = debounce(() => {
      onChange(formik.values);
    }, 1000);
    debouncedChange();
  }, [formik.values, onChange]);

  const activeStepIndex = props.steps.findIndex((s) => s.id === props.step.id);
  const isLastStep = props.steps.length - 1 === activeStepIndex;
  const isFirstStep = activeStepIndex === 0;

  const listFieldRender = (
    <List disablePadding>
      {fields.map((field, idx) => {
        if (!field) {
          return <React.Fragment key={idx}></React.Fragment>;
        }

        const key = `step-${field.id}-${idx}`;
        const fieldRender = (
          <ListItem disableGutters={props.step.disableGutters ?? readOnly}>
            <FormBuilderStepField
              field={field}
              getValues={getStepValues}
              getStepValues={() => formik.values}
              setFieldValue={formik.setFieldValue}
              setFieldTouched={formik.setFieldTouched}
              getTouched={() => formik.touched}
              getErrors={() => formik.errors}
              readOnly={readOnly}
              step={props.step}
            />
          </ListItem>
        );

        return <React.Fragment key={key}>{fieldRender}</React.Fragment>;
      })}
    </List>
  );

  const gridFieldRender = (
    <Grid container spacing={3}>
      {fields.map((field, idx) => {
        if (!field) {
          return <React.Fragment key={idx}></React.Fragment>;
        }

        const skipped = field.skip
          ? field.skip(getValues(), undefined, readOnly)
          : false;

        if (skipped) {
          return <React.Fragment key={idx}></React.Fragment>;
        }

        const key = `step-${field.id}-${idx}`;

        return (
          <Grid item key={key} {...(field.responsive || { xs: 12, md: 12 })}>
            <FormBuilderStepField
              field={field}
              step={props.step}
              getValues={getStepValues}
              getStepValues={() => formik.values}
              setFieldValue={formik.setFieldValue}
              setFieldTouched={formik.setFieldTouched}
              getTouched={() => formik.touched}
              getErrors={() => formik.errors}
              readOnly={readOnly}
            />
          </Grid>
        );
      })}
    </Grid>
  );

  const listFooterRender = (
    <List>
      <ListItem disableGutters={props.step.disableGutters ?? false}>
        <FormBuilderFooter
          step={props.step}
          isSubmitDefined={props.isSubmitDefined}
          getValues={getStepValues}
          isValid={!formik.isValid}
          isSubmitting={formik.isSubmitting}
          isLastStep={isLastStep}
          onBack={
            props.steps.length > 1 && !isFirstStep
              ? () => {
                  props.setActiveStep(props.steps[activeStepIndex - 1]);
                }
              : undefined
          }
        />
      </ListItem>
    </List>
  );

  const gridFooterRender = (
    <Box mt={3}>
      <FormBuilderFooter
        isSubmitDefined={isLastStep ? props.isSubmitDefined : true}
        step={props.step}
        getValues={getStepValues}
        isValid={!formik.isValid}
        isSubmitting={formik.isSubmitting}
        isLastStep={isLastStep}
        onBack={
          props.steps.length > 1 && !isFirstStep
            ? () => {
                props.setActiveStep(props.steps[activeStepIndex - 1]);
              }
            : undefined
        }
      />
    </Box>
  );

  return fields.length > 0 ? (
    <>
      <form onSubmit={formik.handleSubmit}>
        {props.step.isGrid ? gridFieldRender : listFieldRender}
        {!readOnly && (props.step.isGrid ? gridFooterRender : listFooterRender)}
      </form>
    </>
  ) : (
    <></>
  );
};

export const FormBuilderStep = memo(FormBuilderStepWOMemo);
