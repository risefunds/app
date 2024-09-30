import { Grid, ListItemText, Typography } from '@mui/material';
import React from 'react';
import theme from 'utils/theme';

export interface IGenericSectionHeaderProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
}

export const GenericSectionHeader: React.FC<IGenericSectionHeaderProps> = (
  props,
) => {
  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Grid item md={12}>
          <Grid
            container
            justifyContent="space-between"
            alignItems={'center'}
            spacing={2}
          >
            <Grid item>
              <ListItemText
                primaryTypographyProps={{
                  variant: 'caption',
                  color: 'GrayText',
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  color: 'GrayText',
                }}
                primary={props.title}
                secondary={props.subtitle}
              />
            </Grid>
            <Grid item>{props.toolbar}</Grid>
          </Grid>
        </Grid>
        {props.action && <Grid item>{props.action}</Grid>}
      </Grid>
      {props.children}
    </>
  );
};
