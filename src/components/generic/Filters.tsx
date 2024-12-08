import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { utils } from '@risefunds/sdk';

// Define the type for the props
type FiltersProps = {
  selectedFilter: {
    category: string;
  };
  setSelectedFilter: React.Dispatch<
    React.SetStateAction<{
      category: string;
    }>
  >;
};

const Filters: React.FC<FiltersProps> = ({
  selectedFilter,
  setSelectedFilter,
}) => {
  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h6" sx={{ marginBottom: '16px' }}>
        Filter Results
      </Typography>

      {/* Category Filter */}
      <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>
        CATEGORY
      </Typography>
      <FormControl>
        <RadioGroup
          value={selectedFilter.category}
          onChange={(e) =>
            setSelectedFilter({ ...selectedFilter, category: e.target.value })
          }
        >
          <FormControlLabel
            value="All Categories"
            control={<Radio />}
            label="All Categories"
          />
          {utils.categoryUtils.categoryOptions.map((co) => (
            <FormControlLabel
              value={co.value}
              control={<Radio />}
              label={co.label}
              key={co.value}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Filters;
