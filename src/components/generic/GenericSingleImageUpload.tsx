import { Delete, Image as ImageIcon, Remove } from '@mui/icons-material';
import {
  Grid,
  Box,
  ListItemText,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import React, {
  LegacyRef,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GenericSingleImageContext } from '../GenericSingleImageContext';
import { useDropzone } from 'react-dropzone';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  connectStorageEmulator,
} from 'firebase/storage';

import theme from 'utils/theme';
import { GenericTextField } from './TextField/GenericTextField';
import { IFormBuilderFieldCommonProps } from 'components/FormBuilder/types';
import NextImage from 'next/image';
import { v4 } from 'uuid';
import { models } from '@risefunds/sdk';

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export interface IGenericColumnImageUploadFileLocalImage {
  file?: File;
  local?: string;
}

export interface IGenericSingleImageUploadValue
  extends models.IGenericColumnImageUploadFileObject {}

export interface IGenericSingleImageUploadConfig {
  icon?: ReactElement;
  noCaption?: boolean;
  autoUpload?: string;
  width?: number;
  noPrompt?: boolean;
  height?: number;
  borderRadius?: number;
  ratio?: [number, number];
  totalColumns: number;
}

interface IGenericSingleImageUploadProps
  extends IFormBuilderFieldCommonProps<
    IGenericSingleImageUploadConfig,
    IGenericSingleImageUploadValue
  > {}

export const GenericSingleImageUpload: React.FC<
  IGenericSingleImageUploadProps
> = ({ readOnly = false, onChange, ...props }) => {
  const genericSingleImageContext = useContext(GenericSingleImageContext);
  const [ratio, setRatio] = useState([16, 9]);
  const { noCaption = false, autoUpload = true, ...config } = props.config;
  const [boxWidth, setBoxWidth] = useState<number>(0);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const closeWindowRef = useRef<HTMLDivElement | null>(null);
  const [localImage, setLocalImage] = useState<
    IGenericColumnImageUploadFileLocalImage | undefined
  >(undefined);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      genericSingleImageContext?.setLoading(false);
      setLoading(false);
    }
  }, [progress]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', (e) => {
        if (closeWindowRef.current !== null) {
          const confirmationMessage =
            'Uploading is in progress. Are you sure you want to leave?';
          (e || window.event).returnValue = confirmationMessage;
          return confirmationMessage;
        }
      });
    }
  }, []);

  const onDrop = async (droppedFiles: File[]) => {
    if (droppedFiles.length > 0) {
      genericSingleImageContext?.setLoading(true);
      setLoading(true);
      const droppedFile = droppedFiles[0];
      const reader = new FileReader();

      let uploadedImageTemp: models.IGenericColumnImageUploadFileObject = {
        ...(props.value || {}),
        id: props.id,
        name: droppedFile.name,
      };

      reader.onload = async function (e) {
        if (e.target?.result) {
          const img = new Image();
          img.src = e.target?.result as string;

          img.onload = async function () {
            uploadedImageTemp = {
              ...uploadedImageTemp,
              width: img.width,
              height: img.height,
            };

            setLocalImage({
              file: droppedFile,
              local: e.target?.result as string,
            });

            if (autoUpload) {
              const storage = getStorage();
              if (process.env.NEXT_PUBLIC_ENV === 'local') {
                connectStorageEmulator(storage, 'localhost', 9199);
              }

              const fileId = v4();
              const fileRef = storageRef(
                storage,
                `${
                  process.env.NEXT_PUBLIC_BUCKET ||
                  'n3-db-webapp-dev.appspot.com'
                }/${fileId}`
              );

              // Track upload progress using uploadBytesResumable
              const uploadTask = uploadBytesResumable(fileRef, droppedFile);

              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  // Track progress
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setProgress(progress);
                },
                (error) => {
                  // Handle upload error
                  console.error('Upload failed', error);
                  setProgress(404); // Set progress to error state
                },
                async () => {
                  // Upload completed successfully, get download URL
                  const url = await getDownloadURL(uploadTask.snapshot.ref);

                  uploadedImageTemp = {
                    ...uploadedImageTemp,
                    storageRef: uploadTask.snapshot.ref.fullPath,
                    bytes: uploadTask.snapshot.totalBytes, // Correct way to get the transferred bytes
                    url,
                    bucket: uploadTask.snapshot.ref.bucket,
                  };

                  onChange({ ...(props.value || {}), ...uploadedImageTemp });
                  setLoading(false); // Stop loading state
                }
              );
            }
          };
        }
      };

      reader.readAsDataURL(droppedFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/png,image/jpeg,image/gif',
  });

  const placeholderIcon = props.config.icon ?? <ImageIcon />;

  const loadingIcon =
    progress < 100 ? (
      <LinearProgressWithLabel value={progress} />
    ) : progress === 404 ? (
      <Alert variant="outlined" severity="error">
        Image upload failed
      </Alert>
    ) : (
      <Alert variant="outlined" severity="success">
        Upload successful
      </Alert>
    );

  const imageSrc = props.value?.url || localImage?.local;

  const clientWidth =
    props.config?.width ?? (boxRef.current as any)?.clientWidth;
  let clientHeight = props.config?.height ?? undefined;
  if (clientWidth && clientWidth > 0 && ratio) {
    clientHeight = clientWidth * (ratio?.[1] / ratio?.[0]);
  }

  const imageDisplay =
    imageSrc &&
    (loading ? (
      <Box
        sx={{ border: `1px solid ${theme.palette.grey[400]}` }}
        width={props.config.width ?? '100%'}
        height={props.config.height ?? clientHeight ?? '100%'}
        borderRadius={props.config.borderRadius}
        textAlign="center"
      >
        <div ref={boxRef ?? null}>
          <input {...getInputProps()} disabled={loading} />
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Box ref={closeWindowRef} sx={{ width: '80%' }}>
              {loadingIcon}
            </Box>
          </Grid>
        </div>
      </Box>
    ) : (
      <>
        <Box
          width={props.config.width ?? '100%'}
          height={props.config.height ?? clientHeight ?? '100%'}
          borderRadius={props.config.borderRadius}
          textAlign="center"
        >
          <div ref={boxRef ?? null}>
            <Grid
              container
              justifyContent="center"
              sx={{ width: '100%', height: '100%' }}
            >
              <Grid item {...(props.config?.width ? {} : { xs: 12 })}>
                <>
                  <Box
                    sx={{
                      width: props.config.width ?? '100%',
                      height: props.config.height ?? clientHeight ?? '100%',
                      borderRadius: props.config.borderRadius ?? 'initial',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {loading && <LinearProgress />}

                    <NextImage
                      src={imageSrc}
                      objectFit="cover"
                      alt={props.title}
                      layout="fill"
                      placeholder="blur"
                      blurDataURL="/images/partner/partner1.jpg"
                      style={{
                        width: props.config.width ?? '100%',
                        height: props.config.height ?? clientHeight ?? '100%',
                      }}
                    />

                    <Box
                      sx={[
                        {
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          down: 0,
                          height: '100%',
                          width: '100%',
                          opacity: 0,
                        },
                        {
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            opacity: 1,
                          },
                        },
                      ]}
                    >
                      <Grid
                        container
                        alignItems="center"
                        justifyContent={'center'}
                        sx={{ height: '100%' }}
                      >
                        <Grid item>
                          <IconButton
                            onClick={() => {
                              setLoading(true);
                              setLocalImage(undefined);
                              onChange(undefined);
                              setLoading(false);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </>
              </Grid>
            </Grid>
          </div>
        </Box>
      </>
    ));

  const uploader = !imageSrc ? (
    <Box
      sx={{ border: `1px solid ${theme.palette.grey[400]}` }}
      width={props.config.width ?? '100%'}
      height={props.config.height ?? clientHeight ?? '100%'}
      borderRadius={props.config.borderRadius}
      textAlign="center"
    >
      <div ref={boxRef ?? null}>
        <input {...getInputProps()} disabled={loading} />
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{ minHeight: props.config.height ?? clientHeight ?? 500 }}
        >
          <Grid item sx={{ textAlign: 'center', cursor: 'pointer' }}>
            {placeholderIcon}
            <ListItemText
              primaryTypographyProps={{ variant: 'body2' }}
              primary={loading ? 'Uploading...' : `${props.title}`}
              secondary={
                typeof props.config.noPrompt === 'undefined'
                  ? `Click/Drag to upload. Accepted files type: PNG, JPEG.`
                  : undefined
              }
            />
          </Grid>
        </Grid>
      </div>
    </Box>
  ) : (
    <></>
  );

  return (
    <>
      <Box></Box>
      <Box
        {...(imageSrc ? {} : getRootProps())}
        display="flex"
        justifyContent={'center'}
      >
        {imageDisplay}
        {uploader}
      </Box>
      {!noCaption && (
        <Box mt={1} mb={3}>
          <GenericTextField
            onChange={(v) => {
              onChange({
                ...(props.value || {}),
                id: props.id,
                caption: v.target.value,
              });
            }}
            label={`${props.title} Caption`}
          />
        </Box>
      )}
    </>
  );
};
