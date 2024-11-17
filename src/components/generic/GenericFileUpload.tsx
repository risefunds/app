import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  connectStorageEmulator,
} from 'firebase/storage';
import { storage } from 'utils/firebaseConfig';
import { v4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  ListItemText,
  FormLabel,
  IconButton,
  Link,
} from '@mui/material';
import { Delete, Image as ImageIcon } from '@mui/icons-material';
import theme from 'utils/theme';

interface IGenericFileUploadProps {
  config: {
    accept: string;
    multiple?: boolean;
    height?: number;
    path?: string;
    width?: number;
  };
  onChange: (files: { url: string; name: string }[]) => void;
  title?: string;
  readOnly?: boolean;
  value: { url: string; name: string }[];
}

export const GenericFileUpload: React.FC<IGenericFileUploadProps> = ({
  readOnly = false,
  ...props
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<{ url: string; name: string }[]>(
    props.value,
  );

  const onDrop = async (droppedFiles: File[]) => {
    setLoading(true);
    // const storage = getStorage();
    // connectStorageEmulator(storage, 'localhost', 9199);

    const storageFiles = await Promise.all(
      droppedFiles.map(async (file) => {
        const fileId = v4();
        const fileRef = storageRef(
          storage,
          `${
            process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
            'risefunds.appspot.com'
          }/${fileId}`,
        );
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        return { url, name: file.name };
      }),
    );

    setLoading(false);
    setFiles([...files, ...storageFiles]);
  };

  useEffect(() => {
    props.onChange(files);
  }, [files]);

  useEffect(() => {
    if (props.value) setFiles(props.value);
  }, [props.value]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: props.config.multiple ?? false,
    accept: props.config.accept,
  });

  if (readOnly) {
    return (
      <Box>
        <ListItemText
          secondaryTypographyProps={{ variant: 'body1' }}
          primaryTypographyProps={{ variant: 'caption' }}
          primary={props.title}
        />
        {files.map((file, idx) => (
          <ListItemText
            key={`${file.url}-${idx}`}
            primaryTypographyProps={{ variant: 'caption' }}
            secondaryTypographyProps={{ variant: 'body1' }}
            secondary={
              <Link href={file.url} target="_blank">
                {file.name}
              </Link>
            }
          />
        ))}
      </Box>
    );
  }

  let showUploader = true;
  if (!props.config.multiple && files.length > 0) {
    showUploader = false;
  }

  return (
    <Box>
      <FormLabel>{props.title}</FormLabel>
      {showUploader && (
        <Box
          mt={1}
          p={2}
          pt={1}
          style={{
            border: `1px solid ${theme.palette.grey[400]}`,
            height: props.config.height ?? '500px',
            width: props.config.width ?? '100%',
            backgroundColor: theme.palette.grey[100],
            cursor: 'pointer',
          }}
          {...getRootProps()}
          width="100%"
        >
          <input {...getInputProps()} disabled={loading} />
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Grid item sx={{ textAlign: 'center' }}>
              <ImageIcon />
              <ListItemText
                primary={loading ? 'Uploading...' : 'Please click/drag file'}
                secondary={`Accepted files type: ${
                  props.config.accept && props.config.accept !== '*'
                    ? props.config.accept
                    : 'All files'
                }`}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      <Grid container flexDirection={'column'}>
        {files.map((file, idx) => (
          <Grid item key={`${file.url}-${idx}`}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <ListItemText primary={file.name} />
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() =>
                    setFiles(files.filter((f) => f.url !== file.url))
                  }
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
