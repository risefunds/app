import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import { RenderCarouselAction } from './RenderCarouselAction';
import { CreativeActionDropdown } from './CreativeActionDropdown';
import { models } from '@risefunds/sdk';
import { useParams } from 'next/navigation';

interface ICreativeDataTableProps {
  creatives: models.CreativeUserEntityModel[];
  loading: boolean;
}

export const CreativeDataTable: React.FC<ICreativeDataTableProps> = (props) => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    useParams().creativeId?.[0]
      ? {
          items: [
            {
              field: 'id',
              operator: 'contains',
              value: useParams().creativeId?.[0],
            },
          ],
        }
      : { items: [] },
  );

  const columns: GridColDef<models.CreativeUserEntityModel>[] = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'portoflioPercentage',
      width: 100,
      headerName: 'Portfolio %',
      renderCell: (params) => {
        return `${params.row.portoflioPercentage}%`;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.25,
      renderCell: (params) => {
        const details = params.row?.details;
        return !details ? (
          <> </>
        ) : (
          <>
            <Grid container spacing={1}>
              <Grid size={{ xs: 2 }}>
                <Avatar src={details.avatar?.url || details?.avatar?.url}>
                  {details.firstName?.substring(0, 2) ||
                    params.row.details?.firstName?.substring(0, 2)}
                </Avatar>
              </Grid>
              <Grid size={{ xs: 10 }}>
                <Grid container direction="column">
                  <Grid>
                    <Typography variant="body2">
                      {details.firstName || params.row.details?.firstName}{' '}
                      {details.lastName || params.row.details?.lastName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      },
    },
    {
      field: 'country',
      headerName: 'Country',
      flex: 0.15,
      renderCell: (params) => {
        const details = params.row?.details;
        return (
          <>
            <Grid container direction="column">
              {details && (
                <Grid>
                  <Typography variant="body2">
                    {details.country || ''}
                  </Typography>
                </Grid>
              )}
              {details && (
                <Grid>
                  <Typography variant="body2">{details.city || ''}</Typography>
                </Grid>
              )}
              {details && (
                <Grid>
                  <Typography variant="body2">
                    {details.postal || ''}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </>
        );
      },
    },
    {
      field: 'sin',
      headerName: 'SIN',
      flex: 0.15,
      renderCell: (params) => {
        const documents = params.row?.documents;
        return (
          <>
            <Grid container direction="column">
              {documents && (
                <Grid>
                  <Typography variant="body2">{documents.sin || ''}</Typography>
                </Grid>
              )}
            </Grid>
          </>
        );
      },
    },
    {
      field: 'documents',
      headerName: 'Documents',
      flex: 0.15,
      renderCell: (params) => {
        const documents = params.row?.documents;
        return (
          <>
            <Grid
              container
              direction="row"
              justifyContent="start"
              alignItems="flex-start"
            >
              {documents && documents.digitalPhoto && (
                <Grid>
                  <Tooltip title="Digital photo" arrow>
                    <IconButton
                      onClick={() => {
                        if (window && documents.digitalPhoto) {
                          window
                            .open(
                              documents.digitalPhoto.files[0].url,
                              '_blank',
                              'noopener=true,noreferrer=true',
                            )
                            ?.focus();
                        }
                      }}
                    >
                      <PhotoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
              {documents && documents.identity && (
                <Grid>
                  <Tooltip title="ID card" arrow>
                    <IconButton
                      onClick={() => {
                        if (window && documents.identity) {
                          window
                            .open(
                              (
                                documents?.identity as unknown as {
                                  url: string;
                                }[]
                              )[0]?.url,
                              '_blank',
                              'noopener=true,noreferrer=true',
                            )
                            ?.focus();
                        }
                      }}
                    >
                      <BadgeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
              {documents && documents.proofOfAdress && (
                <Grid>
                  <Tooltip title="Address" arrow>
                    <IconButton
                      onClick={() => {
                        if (window && documents.proofOfAdress) {
                          window
                            .open(
                              (
                                documents?.proofOfAdress as unknown as {
                                  url: string;
                                }[]
                              )[0]?.url,
                              '_blank',
                              'noopener=true,noreferrer=true',
                            )
                            ?.focus();
                        }
                      }}
                    >
                      <HomeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
              {documents && documents.sinPhoto && (
                <Grid>
                  <Tooltip title="SIN" arrow>
                    <IconButton
                      onClick={() => {
                        if (window && documents.sinPhoto) {
                          window
                            .open(
                              (
                                documents?.sinPhoto as unknown as {
                                  url: string;
                                }[]
                              )[0]?.url,
                              '_blank',
                              'noopener=true,noreferrer=true',
                            )
                            ?.focus();
                        }
                      }}
                    >
                      <WorkIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
            </Grid>
          </>
        );
      },
    },
    {
      field: 'featured',
      headerName: 'Featured',
      flex: 0.2,
      renderCell: (renderCallParams) => {
        return <RenderCarouselAction {...renderCallParams} />;
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      renderCell: CreativeActionDropdown,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={props.creatives}
          columns={columns}
          columnVisibilityModel={{
            id: false,
          }}
          onFilterModelChange={setFilterModel}
          filterModel={filterModel}
          loading={props.loading}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              creatives: props.creatives,
            },
          }}
        />
      </div>
    </Box>
  );
};

const CustomToolbar = (props: any) => {
  return (
    <Grid
      container
      justifyContent="space-between"
      sx={{ mt: 1, px: 1 }}
      alignItems="center"
    >
      <Grid>
        <Box>
          <Grid container alignItems="center">
            <Grid>
              <Typography variant="body2" sx={{ ml: 1 }}>
                <b>Total Creatives</b>: {(props.creatives || []).length}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid>
        <Grid container alignItems="center">
          <Grid>
            <GridToolbar {...props} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
