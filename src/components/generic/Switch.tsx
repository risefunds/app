import {
  Chip,
  FormControlLabel,
  ListItemText,
  Switch,
  SwitchProps,
} from '@mui/material';
import React from 'react';

interface GenericSwitchProps extends SwitchProps {
  readonly?: boolean;
  activeText: string;
  inActiveText: string;
  label: string;
  subtitle?: string;
}

export const GenericSwitch: React.FC<GenericSwitchProps> = ({
  readOnly = false,
  ...props
}) => {
  if (readOnly) {
    if (props.checked)
      return (
        <ListItemText
          secondaryTypographyProps={{ variant: 'body1' }}
          primaryTypographyProps={{ variant: 'caption' }}
          primary={props.label as string}
          secondary={
            <Chip
              sx={{ mt: 1 }}
              size="small"
              label={props.activeText}
              color="success"
              variant="outlined"
            />
          }
        />
      );

    return (
      <ListItemText
        secondaryTypographyProps={{ variant: 'body1' }}
        primaryTypographyProps={{ variant: 'caption' }}
        primary={props.label as string}
        secondary={
          <Chip
            sx={{ mt: 1 }}
            size="small"
            label={props.inActiveText}
            color="error"
            variant="outlined"
          />
        }
      />
    );
  }
  return (
    <FormControlLabel
      label={<ListItemText primary={props.label} secondary={props.subtitle} />}
      disableTypography
      control={<Switch checked={props.checked} {...props} />}
    />
  );
};
