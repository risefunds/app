import { IFormBuilderFieldCommonProps } from 'components/FormBuilder/types';
import React from 'react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { DatePicker } from '@mui/lab';
import { ListItemText, TextField } from '@mui/material';
import { GenericTextField } from './TextField/GenericTextField';

interface IGenericDateConfig {}
interface IGenericDateValue {}
interface IGenericDateProps
  extends IFormBuilderFieldCommonProps<IGenericDateConfig, IGenericDateValue> {}
export const GenericDate: React.FC<IGenericDateProps> = (props) => {
  if (props.readOnly) {
    return (
      <ListItemText
        primaryTypographyProps={{ variant: 'caption' }}
        primary={props.title}
        secondary={(props.value || new Date()).toString()}
      />
    );
  }
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={props.title}
        value={props.defaultValue || props.value}
        onChange={(newValue: any) => {
          props.onChange(newValue as any);
        }}
        renderInput={(params: any) => (
          <GenericTextField {...params} size="small" fullWidth />
        )}
      />
    </LocalizationProvider>
  );
};
