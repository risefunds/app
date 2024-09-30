import { ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material';
import { IconButton, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import { IFormBuilderFieldCommonProps } from './types';
import { v4 } from 'uuid';

export const withMultipleFields = <C, V>(
  WrappedComponent: React.FC<IFormBuilderFieldCommonProps<C, V>>,
) => {
  type IMultipleFieldsValue = V & {
    id: string;
  };

  interface IIndividualMultipleFieldRender
    extends IFormBuilderFieldCommonProps<C, IMultipleFieldsValue> {
    isLastItem: boolean;
    isFirstItem: boolean;
    onDelete: Function;
  }

  const IndividualMultipleFieldRender: React.FC<
    IIndividualMultipleFieldRender
  > = (props) => {
    const multiFieldMenu = (
      <>
        {!props.isFirstItem && (
          <IconButton>
            <ArrowUpward fontSize="small" />
          </IconButton>
        )}
        {!props.isLastItem && (
          <IconButton>
            <ArrowDownward fontSize="small" />
          </IconButton>
        )}
        <IconButton
          onClick={() => {
            props.onDelete();
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </>
    );
    return (
      <>
        <WrappedComponent
          onChange={(v) => {
            props.onChange(v as any);
          }}
          config={props.config}
          id={props.id}
          title={props.title}
          value={props.value}
          multiFieldMenu={multiFieldMenu}
        />
      </>
    );
  };

  const MultipleFields: React.FC<
    IFormBuilderFieldCommonProps<C, IMultipleFieldsValue[] | undefined>
  > = (props) => {
    const value = (props.value ?? []) as IMultipleFieldsValue[];

    return (
      <>
        {value.map((v, vIdx) => {
          return (
            <IndividualMultipleFieldRender
              key={`${props.id}-multiple-${v.id}`}
              onChange={(cv) => {
                console.log('another gallery', cv);
                if (cv) {
                  props.onChange(
                    (props.value || []).map((ev) => {
                      if (ev.id === v.id) {
                        return { ...v, ...cv };
                      }
                      return ev;
                    }),
                  );
                } else {
                  props.onChange(
                    (props.value || []).filter((ev) => {
                      if (ev.id === v.id) {
                        return false;
                      }
                      return true;
                    }),
                  );
                }
              }}
              isFirstItem={vIdx === 0}
              isLastItem={vIdx === value.length - 1}
              config={props.config}
              onDelete={() => {
                props.onChange(
                  value.filter((ev) => {
                    return ev.id !== v.id;
                  }),
                );
              }}
              value={v}
              id={`${props.id}-multiple-${vIdx}`}
              title={`${props.title} #${vIdx + 1}`}
            />
          );
        })}

        <Box mt={value.length > 0 ? 3 : 0}>
          <ListItemButton
            onClick={() => {
              props.onChange([
                ...value,
                { ...(props.defaultValue || {}), id: v4() },
              ] as any);
            }}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary={`+ New ${props.title}`} />
          </ListItemButton>
        </Box>
      </>
    );
  };

  const CheckMultiple: React.FC<IFormBuilderFieldCommonProps<C, V>> = (
    props,
  ) => {
    return props.multiple ? (
      <MultipleFields
        {...(props as any)}
        value={props.value as never}
        onChange={(v: IMultipleFieldsValue[] | undefined) => {
          props.onChange(v as never);
        }}
      />
    ) : (
      <WrappedComponent {...props} />
    );
  };

  return CheckMultiple;
};
