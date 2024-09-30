import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import React from 'react';

export type IGenericButtonProps = {
  children: string;
} & LoadingButtonProps;

export const GenericButton: React.FC<IGenericButtonProps> = (props) => {
  return (
    <LoadingButton
      disableElevation
      fullWidth
      size="small"
      variant="contained"
      {...props}
    >
      {props.children}
    </LoadingButton>
  );
};
