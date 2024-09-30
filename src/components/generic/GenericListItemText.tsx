import { ListItemText, ListItemTextProps } from '@mui/material';
import React from 'react';

export const GenericListItemText: React.FC<ListItemTextProps> = ({
  secondaryTypographyProps = {},
  primaryTypographyProps = {},
  ...props
}) => {
  return (
    <ListItemText
      secondaryTypographyProps={{
        variant: 'body1',
        ...secondaryTypographyProps,
      }}
      primaryTypographyProps={{ variant: 'caption', ...primaryTypographyProps }}
      {...props}
    />
  );
};
