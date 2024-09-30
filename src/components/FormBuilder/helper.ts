import {
  FormBuilderFieldType,
  IFormBuilderStep,
  FormBuilderValueType,
} from './types';
import jsonParse from 'json-templates';
import jsonlogic, { RulesLogic } from 'json-logic-js';
import _ from 'lodash';
import { transformAll } from '@demvsystems/yup-ast';
import { flatten } from 'flat';
import * as yup from 'yup';
import deepmerge from 'deepmerge';
import { types } from '@risefunds/sdk';
export const getFieldName = (id: string, idx?: number) => {
  let name = id;

  if (idx !== undefined && idx >= 0) {
    name = `${id}[${idx}]`;
  }
  return name;
};

export const getFieldValue = (id: string, formikValues: any, idx?: number) => {
  let value = formikValues[id] ?? '';
  const values = formikValues[id] as any;

  if (idx !== undefined && idx >= 0) {
    value = values[idx] ?? '';
  }
  return value;
};

export const getFieldError = (id: string, formikErrors: any, idx?: number) => {
  let error: any = formikErrors[id];
  const errors = formikErrors[id] as any;
  if (idx !== undefined && idx >= 0) {
    error = errors ? errors[idx] : '';
  }
  return error;
};

export const getFieldTouched = (
  id: string,
  formikTouched: any,
  idx?: number,
) => {
  let touched = formikTouched[id];
  const touches = formikTouched[id] as any;

  if (idx !== undefined && idx >= 0) {
    touched = touches ? touches[idx] : false;
  }
  return touched;
};

export const getFieldFileName = (file: File) => {
  return file.name;
};

const jsonFieldTransformer = <initialValues>(
  field: types.IFormBuilderJSONFieldType,
  parentField: string,
): FormBuilderFieldType<initialValues> => {
  let validation = undefined;
  if (field.validationSchema) {
    try {
      validation = transformAll(field.validationSchema, yup);
    } catch (error) {
      console.error(field.id, error);
    }
  }
  return {
    ...field,
    title: field.title,
    validationSchema: validation,
    skip: field.skip
      ? (values: any, idx?: number) => {
          return jsonlogic.apply(field.skip as RulesLogic, {
            ...(flatten({ values }, { delimiter: '_', safe: true }) as any),
            ...(typeof idx !== 'undefined'
              ? (flatten(
                  { multipleCurrent: values[parentField][idx as number] },
                  { delimiter: '_', safe: true },
                ) as any)
              : {}),
          });
        }
      : undefined,
    defaultValue: undefined,
    config: field.config
      ? (values) => {
          if (field.config) {
            return Object.keys(field.config).reduce((final, next) => {
              if (field.config) {
                const value = field.config[next];

                return {
                  ...final,
                  [next]:
                    typeof value === 'string' && /%([^}]*)%/.test(value)
                      ? ((
                          flatten(
                            { values },
                            { delimiter: '_', safe: true },
                          ) as Record<any, FormBuilderValueType>
                        )[/%([^}]*)%/gi.exec(value)?.[1].trim() ?? ''] ?? '')
                      : value,
                };
              } else {
                return final;
              }
            }, {});
          } else {
            return {};
          }
        }
      : undefined,
    fields:
      field.fields?.map((subfield) =>
        jsonFieldTransformer<initialValues>(subfield, field.id),
      ) ?? undefined,
  } as FormBuilderFieldType<initialValues>;
};

export const getFormBuilderSchemaFromJSON = <
  IValues extends Record<string, FormBuilderValueType>,
>(
  jsonSchema: types.IFormBuilderJSONSchema<IValues>,
  translations: Record<string, string>,
  partialInitialValues: Partial<IValues> = {},
) => {
  const initialValues = deepmerge(
    jsonSchema.initialValues,
    partialInitialValues,
  );

  const template = jsonParse(jsonSchema);
  const translatedTemplate: typeof jsonSchema = template(
    Object.keys(translations).reduce(
      (final, nextKey) => {
        final = {
          ...final,
          [`translation_${nextKey}`]: translations[nextKey],
        };
        return final;
      },
      {} as Record<string, string>,
    ),
  ) as never;

  const steps: IFormBuilderStep<typeof initialValues>[] =
    translatedTemplate.steps.map((step) => {
      return {
        ...step,
        skip: step.skip
          ? (values: any) => {
              return jsonlogic.apply(
                step.skip as RulesLogic,
                flatten({ values }, { delimiter: '_', safe: true }),
              );
            }
          : undefined,
      } as IFormBuilderStep<typeof initialValues>;
    });

  const fields = translatedTemplate.fields.map((field) => {
    return jsonFieldTransformer<typeof initialValues>(field, field.id);
  });

  return {
    id: jsonSchema.id,
    initialValues,
    fields,
    steps,
  };
};
