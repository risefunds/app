import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Icon, IconButton, TextField, TextFieldProps } from '@mui/material';
import React, { useState } from 'react';
import { GenericTextField } from './GenericTextField';

export const GenericPasswordTextField = (props: TextFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <GenericTextField
      {...props}
      type={visible ? 'text' : 'password'}
      placeholder="********"
      InputProps={{
        endAdornment: (
          <IconButton size="small" onClick={() => setVisible(!visible)}>
            {visible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
      }}
    />
  );
};
