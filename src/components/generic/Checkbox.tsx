import {
  Chip,
  FormControlLabel,
  ListItemText,
  Checkbox,
  CheckboxProps,
} from '@mui/material';
import React from 'react';

interface GenericCheckboxProps extends CheckboxProps {
  readonly?: boolean;
  activeText: string;
  inActiveText: string;
  label: string;
  subtitle?: string;
}

export const GenericCheckbox: React.FC<GenericCheckboxProps> = ({
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
      control={<Checkbox checked={props.checked} {...props} />}
    />
  );
};
