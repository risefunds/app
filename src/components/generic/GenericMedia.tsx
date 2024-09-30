import { Delete } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';
import { models } from '@risefunds/sdk';
import { withMultipleFields } from 'components/FormBuilder/withMultipleFields';
import React, { ReactElement, useRef, useState } from 'react';
import { GenericColumnImageUpload } from './GenericColumnImageUpload';
import { GenericTextField } from './TextField/GenericTextField';
import { GenericSection } from './GenericSection';

interface IGenericMediaConfig {
  disableColumns?: true;
}

export type IGenericMediaType = 'gallery' | 'youtubeEmbed';

export const GenericMedia = withMultipleFields<
  IGenericMediaConfig,
  models.IGenericMediaObject
>((props) => {
  const [type, setType] = useState<IGenericMediaType>(
    props.value?.type || 'gallery',
  );

  const mediaSelector: ReactElement = (
    <>
      {/* <Select
      onChange={(e) => {
        setType(e.target.value as IGenericMediaType)
      }}
      disableUnderline
      defaultValue={'gallery'}
      size="small"
      variant="standard"
    >
      <MenuItem value="gallery">Image</MenuItem>
    </Select> */}
    </>
  );

  if (props.readOnly) {
    return (
      <>
        <GenericSection disablePaper disablePadding>
          <Grid container width="100%" justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
              <Box width="100%" height="100%">
                {/* {imageSrc} */}
                <Box mt={1} mb={3}>
                  <GenericTextField
                    readOnly={true}
                    value={props.value?.files[0].caption || ''}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </GenericSection>
      </>
    );
  }

  return (
    <>
      {type === 'gallery' && (
        <GenericColumnImageUpload
          mediaSelector={mediaSelector}
          subtitle={props.subtitle}
          title={`${props.title}`}
          onChange={(value) => {
            console.log('parent set', value);
            if (value) {
              props.onChange({
                type,
                files: value?.files,
              });
            } else {
              props.onChange(undefined);
            }
          }}
          value={{ files: props.value?.files || [] }}
          config={props.config as any}
          id={`${props.id}-GenericMedia`}
        />
      )}
      {/* {type === 'youtubeEmbed' && (
          <GenericVideoEmbed
            onChange={(files) => {}}
            title={props.title}
            id={`${props.id}-GenericMedia`}
            config={{}}
          />
        )} */}
    </>
  );
});
