import React, { ReactElement } from 'react';
import { AlertColor } from '@mui/material';
import { IFormBuilderJSONFieldResponsive } from '@risefunds/sdk/dist/types';
import { types } from '@risefunds/sdk';

export type FormBuilderValueType =
  | types.IFormBuilderBaseValueType
  | types.IFormBuilderBaseValueType[];

export type FormBuilderBaseFieldType<Values> = {
  id: string;
  title: string;
  readOnly?: boolean;
  subtitle?: string;
  tooltip?: string;
  type: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: FormBuilderValueType; label: string }[];
  skip?: (values: Values, idx?: number, readOnly?: boolean) => boolean;
  config?: (values: Values, multipleFieldIndex?: number) => any;
  buttons?: {
    add?: (values: Values, multipleFieldIndex?: number) => any;
    delete?: (values: Values, idx: number) => any;
  };
  defaultValue?: (values: Values) => FormBuilderValueType;
  validationSchema?: any;
  showTitle?: boolean;
  multiple?: boolean;
  onChange?: (
    values: Values,
    fieldValue: FormBuilderValueType,
    setFieldValue: Function,

    idx?: number,
  ) => void;
  alertMessage?: (
    values: Values,
  ) => { message: string; severity?: AlertColor } | undefined;
  custom?: React.FC<ICustomField>;
  responsive?: IFormBuilderJSONFieldResponsive;
};

export interface FormBuilderFieldType<Values>
  extends FormBuilderBaseFieldType<Values> {
  multiple?: boolean;
  fields?: FormBuilderBaseFieldType<Values>[];
}

export interface ICustomField {
  field: FormBuilderFieldType<any>;
  config?: any;
  value: FormBuilderValueType;
  setFieldTouched: Function;
  setFieldValue: Function;
  getValues: Function;
  multipleFieldIndex?: number;
  touched: boolean;
  error: string;
  readOnly?: boolean;
}

export interface IFormBuilderStep<Values> {
  isGrid?: boolean;

  id: string;
  title: string;
  subtitle?: string;
  fields?: string[];
  skip?: (values: Values, readOnly?: boolean) => boolean;
  disableGutters?: boolean;

  footerSubmitTitle?: string;
  footerSubmitIcon?: ReactElement;
  footerSubmitButtonFullWidth?: boolean;
}

export type FormBuilderWizardType<Values> = {
  id?: string;
  active: boolean;
  skip: (values: Values) => boolean;
};

export type FormBuilderActionType<Values> = {
  type: 'NEXT' | 'PREV' | 'UPDATE';
  step?: FormBuilderWizardType<Values>;
  fields?: any;
};

export interface IFormBuilderFieldCommonProps<IExtendedConfig, IExtendedValue> {
  config: IExtendedConfig;
  onChange: (object: IExtendedValue | undefined) => void;
  value?: IExtendedValue | undefined;
  title: string;
  subtitle?: string;
  id: string;
  readOnly?: boolean;
  multiple?: boolean;
  defaultValue?: IExtendedValue | undefined;
  multiFieldMenu?: ReactElement;
  error?: boolean;
  helperText?: string | Record<string, string>;
}
