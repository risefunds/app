import React, { useMemo } from 'react';
import { FormBuilder, IFormBuilderProps } from './FormBuilder';
import { getFormBuilderSchemaFromJSON } from './helper';
import { types } from '@risefunds/sdk';

export type FormBuilderJSONPropsType<
  Values extends types.IFormBuilderInitialValueType,
> = {
  FormBuilderProps: Omit<IFormBuilderProps<Values>, 'id' | 'steps' | 'fields'>;
  schema: types.IFormBuilderJSONSchema<Values>;
};
export const FormBuilderJSON = <
  Values extends types.IFormBuilderInitialValueType,
>(
  props: FormBuilderJSONPropsType<Values>,
) => {
  const parsedSchema = useMemo(
    () =>
      getFormBuilderSchemaFromJSON(
        props.schema as any,
        {},
        (props.FormBuilderProps.initialValues ?? {}) as any,
      ),
    [props.FormBuilderProps.initialValues, props.schema],
  );

  return (
    <FormBuilder
      {...props.FormBuilderProps}
      key={parsedSchema.id}
      id={parsedSchema.id}
      steps={parsedSchema.steps as any}
      fields={parsedSchema.fields as any}
      initialValues={parsedSchema.initialValues as any}
    />
  );
};
