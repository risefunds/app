import React, { memo, useEffect, useState } from 'react';
import { FormBuilderFieldType } from './types';
import _ from 'lodash';
import { Box, InputAdornment, Link, ListItemText } from '@mui/material';
import { GenericTextField } from 'components/generic/TextField/GenericTextField';
import { GenericPasswordTextField } from 'components/generic/TextField/GenericPasswordTextField';
import { GenericAutocomplete } from 'components/generic/GenericAutocomplete/GenericAutocomplete';
import { GenericDollarTextField } from 'components/generic/TextField/DollarTextField';
import { GenericSwitch } from 'components/generic/Switch';
import moment from 'moment';
import { GenericRadioGroup } from 'components/generic/GenericRadioGroup';
import { GenericFileUpload } from 'components/generic/GenericFileUpload';
import { GenericMedia } from 'components/generic/GenericMedia';
import { GenericDate } from 'components/generic/GenericDate';
import { GenericCheckbox } from 'components/generic/Checkbox';
import { FieldID } from 'components/generic/FieldID';
import { GenericSingleImageUpload } from 'components/generic/GenericSingleImageUpload';

type FormBuilderField = {
  multipleFieldIndex?: number;
  field: FormBuilderFieldType<any>;
  readOnly?: boolean;
  value: any;
  setFieldValue: Function;
  touched?: any;
  error?: any;
  setFieldTouched: Function;
  getValues: Function;
};

const FormBuilderField = ({ readOnly = false, ...props }: FormBuilderField) => {
  const [config, setConfig] = useState(
    props.field.config
      ? props.field.config(props.getValues(), props.multipleFieldIndex)
      : {},
  );

  useEffect(() => {
    if (props.field.config) {
      if (
        ['text', 'email', 'link', 'number', 'switch', 'radio'].includes(
          props.field.type,
        )
      ) {
        const updatedConfig = props.field.config
          ? props.field.config(props.getValues(), props.multipleFieldIndex)
          : {};
        if (
          Object.keys(updatedConfig).some((k) => {
            if (Array.isArray(config[k])) {
              if (!_.isEqual(config[k], updatedConfig[k])) {
                return true;
              } else {
                return false;
              }
            }
            if (typeof config[k] === 'function') {
              return false;
            }
            if (config[k] instanceof Date) {
              if (!moment(config[k]).isSame(updatedConfig[k])) {
                return true;
              } else {
                return false;
              }
            }
            if (config[k] !== updatedConfig[k]) {
              return true;
            }
            return false;
          })
        ) {
          setConfig(updatedConfig);
        }
      }
    }
  }, [config, props, props.field.config]);

  const value = props.value;
  const error = props.error;
  const touched = props.touched;

  // if (readOnly && props.field.readOnlyChildren) {
  //   return React.createElement(props.field.readOnlyChildren, {
  //     values: props.getValues(),
  //   })
  // }

  if (
    props.field.type === 'text' ||
    props.field.type === 'email' ||
    props.field.type === 'number'
  ) {
    return (
      <Box width="100%">
        <GenericTextField
          required={
            props.field.required === undefined ? false : props.field.required
          }
          label={props.field.title}
          value={config?.value ?? value ?? ''}
          type={props.field.type}
          fullWidth
          onBlur={() => {
            props.setFieldTouched();
          }}
          variant={config.variant ?? 'outlined'}
          size="small"
          onChange={(e) => {
            props.setFieldValue(e.target.value);
          }}
          readOnly={readOnly}
          error={touched && !!error}
          placeholder={config.placeholder}
          helperText={touched && error}
          multiline={config.multiline}
          minRows={config.rows}
          disabled={config?.disabled}
          InputProps={
            config.endAdornment
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      {config.endAdornment}
                    </InputAdornment>
                  ),
                }
              : config.startAdornment
                ? {
                    startAdornment: (
                      <InputAdornment position="start">
                        {config.endAdornment}
                      </InputAdornment>
                    ),
                  }
                : {}
          }
          subtitle={props.field.subtitle}
        />
      </Box>
    );
  }

  if (props.field.type === 'link') {
    if (readOnly) {
      return (
        <ListItemText
          secondaryTypographyProps={{ variant: 'body1' }}
          primaryTypographyProps={{ variant: 'caption' }}
          primary={props.field.title as string}
          secondary={
            !!(config?.value ?? value) ? (
              <Link href={config?.value ?? value} target="_blank">
                {config?.value ?? value}
              </Link>
            ) : (
              '-'
            )
          }
        />
      );
    }
    return (
      <Box width="100%">
        <GenericTextField
          subtitle={props.field.subtitle}
          required={
            props.field.required === undefined ? false : props.field.required
          }
          label={props.field.title}
          value={config?.value ?? value ?? ''}
          type={props.field.type}
          fullWidth
          onBlur={() => {
            props.setFieldTouched();
          }}
          variant={config.variant ?? 'outlined'}
          size="small"
          onChange={(e) => {
            props.setFieldValue(e.target.value);
          }}
          readOnly={readOnly}
          error={touched && !!error}
          placeholder={config.placeholder}
          helperText={touched && error}
          multiline={config.multiline}
          minRows={config.rows}
          disabled={config?.disabled}
          InputProps={
            config.endAdornment
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      {config.endAdornment}
                    </InputAdornment>
                  ),
                }
              : {}
          }
        />
      </Box>
    );
  }

  if (props.field.type === 'dollar') {
    return (
      <Box width="100%">
        <GenericDollarTextField
          subtitle={props.field.subtitle}
          required={
            props.field.required === undefined ? true : props.field.required
          }
          label={props.field.title}
          value={config?.value ?? value ?? ''}
          type={props.field.type}
          fullWidth
          onBlur={() => {
            props.setFieldTouched();
          }}
          variant={config.variant ?? 'outlined'}
          onChange={(e) => {
            props.setFieldValue(e.target.value);
          }}
          readOnly={readOnly}
          error={touched && !!error}
          placeholder={config.placeholder}
          helperText={touched && error}
          disabled={config?.disabled}
        />
      </Box>
    );
  }

  if (props.field.type === 'password') {
    return (
      <Box width="100%">
        <GenericPasswordTextField
          required={
            props.field.required === undefined ? true : props.field.required
          }
          label={props.field.title}
          value={config?.value ?? value ?? ''}
          fullWidth
          onBlur={() => {
            props.setFieldTouched();
          }}
          variant={config.variant ?? 'outlined'}
          size="small"
          onChange={(e) => {
            props.setFieldValue(e.target.value);
          }}
          error={touched && !!error}
          helperText={touched && error}
          multiline={config.multiline}
          rows={config.rows}
          disabled={config?.disabled}
        />
      </Box>
    );
  }

  if (props.field.type === 'autocomplete') {
    return (
      <GenericAutocomplete
        value={value}
        onChange={(values: any) => {
          props.setFieldValue(values);
        }}
        error={touched && !!error}
        helperText={touched && error}
        label={props.field.title}
        name={config.name}
        options={config.options}
        readOnly={readOnly}
        placeholder={config.placeholder}
        Config={config}
      />
    );
  }

  if (props.field.type === 'switch') {
    return (
      <GenericSwitch
        checked={config.value ?? value ?? false}
        activeText={config.activeText}
        inActiveText={config.inActiveText}
        readOnly={readOnly}
        label={props.field.title as string}
        onChange={(event) => props.setFieldValue(event.target.checked)}
      />
    );
  }

  if (props.field.type === 'checkbox') {
    return (
      <GenericCheckbox
        checked={config.value ?? value ?? false}
        activeText={config.activeText}
        inActiveText={config.inActiveText}
        readOnly={readOnly}
        label={props.field.title as string}
        onChange={(event) => props.setFieldValue(event.target.checked)}
      />
    );
  }
  if (props.field.type === 'radio') {
    return (
      <GenericRadioGroup
        id={props.field.id}
        error={touched && !!error}
        helperText={touched && error}
        readOnly={readOnly}
        title={props.field.title as string}
        subtitle={props.field.subtitle as string}
        value={value}
        onChange={(value) => {
          props.setFieldValue(value);
        }}
        config={config}
      />
    );
  }

  if (props.field.type === 'file') {
    return (
      <GenericFileUpload
        config={config}
        title={props.field.title as string}
        onChange={(files: { url: string; name: string }[]) =>
          props.setFieldValue(files)
        }
        value={config.value ?? value ?? []}
        readOnly={readOnly}
      />
    );
  }

  if (props.field.type === 'avatar') {
    return (
      <GenericSingleImageUpload
        id={props.field.id}
        config={config}
        title={props.field.title as string}
        onChange={(files) => props.setFieldValue(files)}
        value={config.value ?? value ?? []}
        readOnly={readOnly}
      />
    );
  }

  if (props.field.type === 'media') {
    return (
      <Box width="100%">
        <GenericMedia
          config={config}
          id={props.field.id}
          title={props.field.title as string}
          onChange={props.setFieldValue as any}
          value={value}
          multiple={props.field.multiple}
          readOnly={readOnly}
        />
      </Box>
    );
  }

  if (props.field.type === 'date') {
    return (
      <>
        <GenericDate
          config={config}
          id={props.field.id}
          title={props.field.title as string}
          onChange={props.setFieldValue as any}
          value={value}
          multiple={props.field.multiple}
          readOnly={readOnly}
        />
      </>
    );
  }

  if (props.field.type === 'id') {
    return (
      <>
        <FieldID
          config={config}
          id={props.field.id}
          title={props.field.title as string}
          onChange={props.setFieldValue as any}
          value={value}
          multiple={props.field.multiple}
          readOnly={readOnly}
        />
      </>
    );
  }

  return <>Not Implemented</>;
};

export default memo(FormBuilderField);
