import {
  Autocomplete,
  ListItemText,
  Chip,
  createFilterOptions,
  Typography,
  MenuItem,
} from '@mui/material';
import React from 'react';
import { GenericTextField } from '../TextField/GenericTextField';

export interface IGenericAutocompleteConfig {
  addMore?: boolean;
  multiple?: boolean;
  dropdown?: boolean;
}

interface IGenericAutoCompleteFilterOption {
  label: string;
  value?: string;
  displayLabel?: string;
}
export interface IGenericAutocomplete {
  loading?: boolean;
  onChange: any;
  value?: IGenericAutoCompleteFilterOption | IGenericAutoCompleteFilterOption[];
  label: string;
  placeholder?: string;
  name: string;
  options: IGenericAutoCompleteFilterOption[];
  readOnly?: boolean;
  subtitle?: string;
  error?: boolean;
  helperText?: { value: string } | string;
  Config?: IGenericAutocompleteConfig;
}

const filter = createFilterOptions<IGenericAutoCompleteFilterOption>();

export const GenericAutocomplete: React.FC<IGenericAutocomplete> = ({
  readOnly = false,
  options = [],
  loading = false,
  ...props
}) => {
  const hasDropdown = props.Config?.dropdown ? props.Config?.dropdown : true;
  options = options.map((opt) => {
    return {
      value: opt.value || opt.label,
      label: opt.label,
    };
  });

  if (readOnly) {
    return (
      <ListItemText
        secondaryTypographyProps={{ variant: 'body1' }}
        primaryTypographyProps={{ variant: 'caption' }}
        primary={props.label as string}
        secondary={
          Array.isArray(props.value)
            ? props.value.map((v) => v.label).join(', ')
            : props.value?.label
        }
      />
    );
  }

  return (
    <>
      <Autocomplete
        loading={loading}
        value={props.value as IGenericAutoCompleteFilterOption}
        onChange={(_e, value) => {
          props.onChange(value);
        }}
        filterOptions={(options, state) => {
          const filtered = filter(options, state);

          const { inputValue } = state;
          const isExisting = options.some(
            (option) => inputValue === option.value,
          );
          if (props.Config?.addMore)
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                value: inputValue,
                displayLabel: `Add ${props.label} - "${inputValue}"`,
                label: inputValue,
              });
            }

          return filtered;
        }}
        options={options ?? []}
        fullWidth
        sx={{ width: '100%' }}
        size="small"
        multiple={props.Config?.multiple ?? false}
        getOptionLabel={(option) => {
          return option.label ?? '';
        }}
        renderOption={(optionProps, option) => {
          return (
            <MenuItem {...optionProps} value={option.value}>
              {option.displayLabel ?? option.label ?? ''}
            </MenuItem>
          );
        }}
        renderTags={(value, getTagProps) => {
          return value.map((v, index) => {
            return (
              <Chip
                size="small"
                label={<Typography variant="caption">{v?.label}</Typography>}
                {...getTagProps({ index })}
                key={index}
              />
            );
          });
        }}
        renderInput={(params) => {
          return (
            <GenericTextField
              {...params}
              InputProps={{
                ...params.InputProps,
                ...(hasDropdown
                  ? {}
                  : {
                      endAdornment: <></>,
                      onMouseDownCapture: (e) => e.stopPropagation(),
                    }),
              }}
              subtitle={props.subtitle}
              label={props.label}
              name={props.name}
              helperText={
                typeof props.helperText === 'string'
                  ? props.helperText
                  : props.helperText?.value
              }
              error={props.error}
              placeholder={props.placeholder || ''}
            />
          );
        }}
      />
    </>
  );
};
