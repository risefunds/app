import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  ListItemText,
  Grid,
  Typography,
  FormHelperText,
  Chip,
} from '@mui/material';
import React from 'react';
import {
  IFormBuilderFieldCommonProps,
  FormBuilderValueType,
} from 'components/FormBuilder/types';
import { IFormBuilderAutoCompleteOption } from '@risefunds/sdk/dist/types';

interface IGenericRadioGroupProps
  extends IFormBuilderFieldCommonProps<
    {
      options: { value: string; title: string; subtitle: string }[];
      chip: boolean;
    },
    IFormBuilderAutoCompleteOption
  > {}

export const GenericRadioGroup: React.FC<IGenericRadioGroupProps> = ({
  readOnly = false,

  ...props
}) => {
  const getValue = (value = props.value?.value) => {
    return props.config.options.find(
      (option) => String(option.value) === value,
    );
  };

  if (readOnly) {
    return (
      <ListItemText
        secondaryTypographyProps={{ variant: 'body1' }}
        primaryTypographyProps={{ variant: 'caption' }}
        primary={props.title as string}
        secondary={getValue()?.title}
      />
    );
  }
  return (
    <FormControl error={props.error}>
      <FormLabel>
        <Typography variant="caption">{props.title}</Typography>
      </FormLabel>
      <RadioGroup
        value={props.value?.value}
        onChange={(e) => {
          const option = getValue(e.target.value);
          if (option) {
            props.onChange({ label: option.title, value: option.value });
          }
        }}
      >
        <Grid container flexDirection={'row'}>
          {props.config.options.map((option, idx) => {
            return (
              <Grid item key={`option-${option.value}-${idx}`}>
                <FormControlLabel
                  value={option.value}
                  control={<Radio size="small" />}
                  label={
                    <ListItemText
                      primary={option.title}
                      secondary={option.subtitle}
                    />
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>
      {props.helperText && (
        <FormHelperText sx={{ mx: 0 }}>
          {typeof props.helperText === 'string'
            ? props.helperText
            : (props.helperText?.value ?? '')}
        </FormHelperText>
      )}
    </FormControl>
  );
};
