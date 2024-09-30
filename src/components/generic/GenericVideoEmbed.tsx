import { PlayCircle } from '@mui/icons-material';
import { Box } from '@mui/system';
import { IFormBuilderFieldCommonProps } from 'components/FormBuilder/types';
import React from 'react';
import { GenericSingleImageUpload } from './GenericSingleImageUpload';
import { GenericTextField } from './TextField/GenericTextField';
interface IGenericVideoEmbedProps
  extends IFormBuilderFieldCommonProps<{}, {}> {}
export const GenericVideoEmbed: React.FC<IGenericVideoEmbedProps> = (props) => {
  return (
    <>
      <Box mb={3}>
        <GenericTextField
          label="Youtube Embed URL"
          placeholder="https://www.youtube.com/watch?v=hbMUGbDM-60"
        />
      </Box>
      <GenericSingleImageUpload
        onChange={() => {}}
        title={`Default image for ${props.title} Video`}
        subtitle={props.subtitle}
        config={{
          icon: <PlayCircle />,
          noCaption: true,
          totalColumns: 1,
        }}
        id={`${props.id}-GenericVideoEmbed`}
      />
    </>
  );
};
