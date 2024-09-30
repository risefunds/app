import {
  GenericSectionHeader,
  IGenericSectionHeaderProps,
} from 'components/generic/GenericSectionHeader';
import React from 'react';
import { IFormBuilderStep } from './types';

export interface IFormBuilderHeaderChildrenProps {
  FormBuilderHeaderProps: IFormBuilderHeaderProps;
}
export interface IFormBuilderHeaderExportedProps {
  GenericSectionHeaderProps?: IGenericSectionHeaderProps;
  Children?: React.FC<
    Omit<IFormBuilderHeaderChildrenProps, 'GenericSectionHeaderProps'>
  >;
}

export interface IFormBuilderHeaderProps
  extends IFormBuilderHeaderExportedProps {
  steps: IFormBuilderStep<any>[];
  activeStep: IFormBuilderStep<any>;
  setActiveStep: (updatedActiveStep: IFormBuilderStep<any>) => void;
}
export const FormBuilderHeader: React.FC<IFormBuilderHeaderProps> = ({
  Children,
  GenericSectionHeaderProps = {},
  ...props
}) => {
  return (
    <>
      <GenericSectionHeader {...GenericSectionHeaderProps}>
        {Children && <Children FormBuilderHeaderProps={{ ...props }} />}
      </GenericSectionHeader>
    </>
  );
};
