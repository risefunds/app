import React, { useEffect, useState } from 'react';
import { getIn } from 'formik';
import { FormBuilderFieldType, IFormBuilderStep } from './types';
import FormBuilderField from './FormBuilderField';

type FormBuilderStepItemPropsType = {
  getValues: Function;
  getStepValues: Function;
  field: FormBuilderFieldType<any>;
  setFieldValue: Function;
  setFieldTouched: Function;
  getTouched: Function;
  getErrors: Function;
  readOnly?: boolean;
  step: IFormBuilderStep<any>;
};

const FormBuilderStepField = (props: FormBuilderStepItemPropsType) => {
  const [skipped, setSkipped] = useState(
    props.field.skip
      ? props.field.skip(props.getValues(), undefined, props.readOnly)
      : false
  );

  useEffect(() => {
    const changedValue = props.field.skip
      ? props.field.skip(props.getValues())
      : false;

    if (changedValue !== skipped) {
      setSkipped(changedValue);
    }
  }, [props.getValues()]);

  if (skipped) {
    return <React.Fragment></React.Fragment>;
  }
  const v = getIn(props.getStepValues(), props.field.id);
  if (!props.field) {
    return <React.Fragment></React.Fragment>;
  }

  let returnComponent = (
    <FormBuilderField
      getValues={props.getValues}
      field={props.field}
      readOnly={props.readOnly}
      value={v}
      setFieldValue={(updatedValues: any) => {
        props.setFieldValue(props.field.id, updatedValues);
        if (props.field.onChange)
          props.field.onChange(
            props.getValues(),
            updatedValues,
            props.setFieldValue
          );
      }}
      setFieldTouched={(idx?: number) => {
        if (props.setFieldTouched) props.setFieldTouched(props.field.id);
      }}
      touched={getIn(props.getTouched(), props.field.id)}
      error={getIn(props.getErrors(), props.field.id)}
    />
  );

  if (returnComponent) {
    return returnComponent;
  }

  return <></>;
};

export default FormBuilderStepField;
