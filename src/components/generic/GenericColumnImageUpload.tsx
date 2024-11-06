import { Delete, ViewColumn } from '@mui/icons-material';
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { IFormBuilderFieldCommonProps } from 'components/FormBuilder/types';
import React, { ReactElement, useEffect, useState } from 'react';
import { useContext } from 'react';
import { GenericSection } from './GenericSection';
import {
  GenericSingleImageUpload,
  IGenericSingleImageUploadConfig,
  IGenericSingleImageUploadValue,
} from './GenericSingleImageUpload';

interface IGenericColumnImageUploadValue {
  files: IGenericSingleImageUploadValue[];
}

interface IGenericColumnImageUploadConfig
  extends IGenericSingleImageUploadConfig {
  disableColumns?: boolean;
}

interface IGenericColumnImageUploadProps
  extends IFormBuilderFieldCommonProps<
    IGenericColumnImageUploadConfig,
    IGenericColumnImageUploadValue
  > {
  mediaSelector: ReactElement;
}

export const GenericColumnImageUpload: React.FC<
  IGenericColumnImageUploadProps
> = (props) => {
  const getFiles = () => props.value?.files || [];

  const [columns, setColumns] = useState(getFiles().length || 1);
  const { disableColumns = false, ...genericSingleImageUploadConfig } =
    props.config;
  const [columnMenuRef, setColumnMenuRef] = useState<any | undefined>(
    undefined,
  );
  const updateFiles = (
    oldFiles: IGenericSingleImageUploadValue[],
    newFile: IGenericSingleImageUploadValue,
  ) => {
    if (oldFiles.some((efi) => efi.id === newFile.id)) {
      oldFiles = oldFiles.map((ef) => {
        ef = { ...ef, ...newFile };
        return ef;
      });
    } else {
      oldFiles = [...oldFiles, newFile];
    }
    return oldFiles;
  };

  const handleChange = (
    fileId: string,
    newFile?: IGenericSingleImageUploadValue,
  ) => {
    if (newFile) {
      props.onChange({
        files: updateFiles(getFiles(), newFile),
      });
    } else {
      if (getFiles().length > 0) {
        props.onChange({
          files: getFiles().filter((ef) => {
            return ef.id !== fileId;
          }),
        });
      }
    }
  };

  return (
    <>
      <GenericSection
        disablePaper
        disablePadding
        GenericSectionHeaderProps={{
          title: '',
          subtitle: props.subtitle,
          toolbar: <>{props.multiFieldMenu}</>,
          action: (
            <>
              <Stack direction="row" spacing={1}>
                {props.mediaSelector}
                {!disableColumns && (
                  <>
                    <Menu
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      open={Boolean(columnMenuRef)}
                      elevation={1}
                      anchorEl={columnMenuRef}
                      onClose={() => {
                        setColumnMenuRef(undefined);
                      }}
                    >
                      {[...Array(2)].map((_x: number, i: number) => {
                        return (
                          <MenuItem
                            key={`${props.id}-GenericMedia-columns-${i}`}
                            dense
                            onClick={() => {
                              setColumns(i + 1);
                              setColumnMenuRef(undefined);
                            }}
                          >
                            <Typography variant="body2">{`${
                              i + 1
                            } Columns`}</Typography>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                    <IconButton
                      onClick={() => {
                        props.onChange(undefined);
                      }}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        setColumnMenuRef(e.currentTarget);
                      }}
                    >
                      <ViewColumn />
                    </IconButton>
                  </>
                )}
              </Stack>
            </>
          ),
        }}
      >
        <Grid container width="100%">
          {[...Array(columns)].map((_x: number, i: number) => {
            const imageNumber = `#${i + 1}`;
            const fileId = `${props.id}-GenericColumnImageUpload-${imageNumber}`;
            return (
              <Grid item xs={12 / columns} key={fileId}>
                <Box
                  key={`${props.id}-GenericSingleImageUpload-${i}-${columns}`}
                  pl={columns === 2 ? (i % 2 === 0 ? 0 : 1.5) : 0}
                  pr={columns === 2 ? (i % 2 !== 0 ? 0 : 1.5) : 0}
                  width="100%"
                  height="100%"
                >
                  <GenericSingleImageUpload
                    value={getFiles().find((f) => f.id === fileId)}
                    onChange={(file) => {
                      handleChange(fileId, file);
                    }}
                    title={`${props.title} Image ${
                      columns > 1 ? imageNumber : ''
                    }`}
                    id={fileId}
                    config={{
                      ...genericSingleImageUploadConfig,
                      totalColumns: columns,
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </GenericSection>
    </>
  );
};
