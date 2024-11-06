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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RenderCarouselAction } from './RenderCarouselAction';
import { CreativeActionDropdown } from './CreativeActionDropdown';
import { AppContext } from 'context/AppContext';
import { models } from '@risefunds/sdk';
import { Close, Link, Mail } from '@mui/icons-material';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

interface ICreativeDataTableProps {
  creatives: models.CreativeUserEntityModel[];
  loading: boolean;
}

export const CreativeDataTable: React.FC<ICreativeDataTableProps> = (props) => {
  const router = useRouter();
  const appContext = useContext(AppContext);
  const searchParams = useSearchParams();

  // const [filterModel, setFilterModel] = useState<GridFilterModel>({
  //   items: [],
  // });

  // useEffect(() => {
  //   if (creativeId) {
  //     setFilterModel({
  //       items: [
  //         {
  //           field: 'id',
  //           operator: 'contains',
  //           value: creativeId,
  //         },
  //       ],
  //     });
  //   }
  // }, [creativeId]);

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
                      {details.firstName || params.row.details?.firstName}
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
      field: 'websites',
      headerName: 'External Websites',
      flex: 0.15,
      renderCell: (params) => {
        const details = params.row?.details;
        return (
          <>
            <Grid container direction="column">
              {details && (
                <Grid>
                  <Typography variant="body2">
                    {details.website || ''}
                  </Typography>
                </Grid>
              )}
              {details && (
                <Grid>
                  <Typography variant="body2">{details.twitter}</Typography>
                </Grid>
              )}
              {details && (
                <Grid>
                  <Typography variant="body2">{details.instagram}</Typography>
                </Grid>
              )}
              {details && (
                <Grid>
                  <Typography variant="body2">{details.facebook}</Typography>
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
