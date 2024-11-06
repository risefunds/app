import React, { useState, useContext, useEffect } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { AppContext } from 'context/AppContext';
import { GridRenderCellParams } from '@mui/x-data-grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { models } from '@risefunds/sdk';
import { handleFeatureRevalidate } from 'server/serverActions';

export const RenderCarouselAction: React.FC<
  GridRenderCellParams<any, models.CreativeUserEntityModel, any>
> = (props) => {
  const appContext = useContext(AppContext);
  const creativeUser = props.row;

  return (
    <Select
      sx={{ width: '100%' }}
      multiple
      placeholder="Select Featured"
      value={Array.isArray(props.row.featured) ? props.row.featured : []}
      onChange={async (event) => {
        const selectedValue = event.target.value as string[];
        try {
          creativeUser.featured = selectedValue;
          await appContext.sdkServices?.core.CreativeUserEntityService.persist(
            creativeUser,
          );
          await handleFeatureRevalidate();

          appContext.helper.showSuccess('Featured updated successfully');
        } catch (error) {
          appContext.helper.showError(error);
        }
      }}
      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
      renderValue={(selected) => {
        console.log(selected);
        return (selected || []).map((value: string) => (
          <Chip
            key={value}
            label={value}
            sx={{ mr: 1, textTransform: 'capitalize' }}
          />
        ));
      }}
    >
      {models.featuredCreativeOptions.map((option: string) => (
        <MenuItem
          key={`creativeFeatured-${option}`}
          value={option}
          sx={{ textTransform: 'capitalize' }}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};
