import {
  TextFieldProps,
  TextField,
  ListItemText,
  FormLabel,
  FormControl,
} from '@mui/material';
import React, { useRef } from 'react';
import { GenericListItemText } from '../GenericListItemText';

export type IGenericTextFieldPropsType = TextFieldProps & {
  readOnly?: boolean;
  subtitle?: string;
};

export const GenericTextField: React.FC<IGenericTextFieldPropsType> = ({
  readOnly = false,
  label,
  subtitle,
  ...props
}) => {
  const textFieldRef = useRef<any | undefined>();
  if (readOnly) {
    return (
      <GenericListItemText
        secondaryTypographyProps={{ variant: 'body1' }}
        primaryTypographyProps={{ variant: 'caption' }}
        primary={label as string}
        secondary={(props.value as string) || '-'}
      />
    );
  }
  return (
    <FormControl
      onClick={() => {
        if (textFieldRef.current) {
          textFieldRef.current.focus();
        }
      }}
      sx={{ width: '100%' }}
    >
      <FormLabel error={props.error} sx={{ cursor: 'pointer' }}>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ variant: 'body2' }}
          secondary={subtitle}
          secondaryTypographyProps={{ variant: 'body2', color: 'gray' }}
          sx={{ mb: 0 }}
        />
      </FormLabel>
      <TextField
        inputRef={(r) => (textFieldRef.current = r)}
        margin="dense"
        fullWidth
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        FormHelperTextProps={{ sx: { mx: 0 } }}
        {...props}
      />
    </FormControl>
  );
};
