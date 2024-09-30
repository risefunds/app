import { Box, CardContent, List, ListItem, Paper } from '@mui/material';
import React, { useContext } from 'react';
import {
  GenericSectionHeader,
  IGenericSectionHeaderProps,
} from './GenericSectionHeader';

interface IGenericSectionProps {
  GenericSectionHeaderProps?: IGenericSectionHeaderProps;
  disablePadding?: true;
  disablePaper?: true;
  children?: React.ReactNode;
}

export const GenericSection: React.FC<IGenericSectionProps> = ({
  disablePadding = false,
  disablePaper = false,
  ...props
}) => {
  const content = (
    <>
      <Box pt={0.5}>
        <List disablePadding={disablePadding}>
          <ListItem
            disableGutters={disablePadding}
            dense={disablePadding ? true : false}
          >
            <GenericSectionHeader {...props.GenericSectionHeaderProps} />
          </ListItem>
        </List>
      </Box>
      <Box pb={disablePadding ? 0 : 3}>{props.children}</Box>
    </>
  );
  return disablePaper ? content : <Paper elevation={1}>{content}</Paper>;
};
