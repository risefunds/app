import { InputAdornment, ListItemText } from '@mui/material';
import React from 'react';
import {
  GenericTextField,
  IGenericTextFieldPropsType,
} from './GenericTextField';

export const GenericDollarTextField: React.FC<IGenericTextFieldPropsType> = (
  props,
) => {
  if (props.readOnly) {
    return (
      <ListItemText
        secondaryTypographyProps={{ variant: 'body1' }}
        primaryTypographyProps={{ variant: 'caption' }}
        primary={props.label as string}
        secondary={props.value ? `$${props.value}` : '-'}
      />
    );
  }
  return (
    <GenericTextField
      {...props}
      type="number"
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
    />
  );
};
