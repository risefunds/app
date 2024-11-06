import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridToolbar,
  GridValueGetter,
} from '@mui/x-data-grid';
import React, { useState } from 'react';
import { RenderCarouselAction } from './RenderCarouselAction';
import { CampaignActionDropdown } from './CampaignActionDropdown';
import { models } from '@risefunds/sdk';
import { useParams } from 'next/navigation';

interface ICampaignDataTableProps {
  campaigns: models.CampaignEntityModel[];
  loading: boolean;
}

export const CampaignDataTable: React.FC<ICampaignDataTableProps> = (props) => {
  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    useParams().creativeId?.[0]
      ? {
          items: [
            {
              field: 'creativeId',
              operator: 'contains',
              value: useParams().creativeId?.[0],
            },
          ],
        }
      : { items: [] },
  );

  const columns: GridColDef<models.CampaignEntityModel>[] = [
    {
      field: `creativeId`,
      headerName: 'Creative ID',
      valueFormatter: (params: any) => {
        console.log('params:', params);
        return params?.row?.getSingleParentMandatoryReference(
          models.CreativeUserEntityModel.collection,
        );
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 0.15,
      valueGetter: (params: { row: models.CampaignEntityModel }) => {
        console.log('params:', params);
        params?.row?.campaignTitle || '';
      },
    },
    {
      field: 'type',
      headerName: 'Category & Tags',
      flex: 0.15,
      renderCell: (params) => {
        return (
          <>
            <Grid container direction="column">
              <Grid>
                <Typography variant="body2">
                  {params.row.campaignCategory?.value?.toString() || ''}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2">
                  {(params.row.campaignTags ?? [])
                    .map((pt) => pt.label)
                    .join(',')}
                </Typography>
              </Grid>
            </Grid>
          </>
        );
      },
    },
    {
      field: 'featured',
      headerName: 'Featured',
      renderCell: RenderCarouselAction,
      flex: 0.15,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: CampaignActionDropdown,
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={props.campaigns}
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
              creatives: props.campaigns,
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
