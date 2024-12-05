import React from 'react';
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

// Define the type for the props
type FiltersProps = {
  selectedFilter: {
    category: string;
    timing: string;
  };
  setSelectedFilter: React.Dispatch<React.SetStateAction<{
    category: string;
    timing: string;
  }>>;
};

const Filters: React.FC<FiltersProps> = ({ selectedFilter, setSelectedFilter }) => {
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
          onChange={(e) => setSelectedFilter({ ...selectedFilter, category: e.target.value })}
        >
          <FormControlLabel value="All Categories" control={<Radio />} label="All Categories" />
          <FormControlLabel value="Tech & Innovation" control={<Radio />} label="Tech & Innovation" />
          <FormControlLabel value="Creative Works" control={<Radio />} label="Creative Works" />
          <FormControlLabel value="Community Projects" control={<Radio />} label="Community Projects" />
        </RadioGroup>
      </FormControl>

      {/* Campaign Timing Filter */}
      <Typography variant="subtitle1" sx={{ marginTop: '16px' }}>
        CAMPAIGN TIMING
      </Typography>
      <FormControl>
        <RadioGroup
          value={selectedFilter.timing}
          onChange={(e) => setSelectedFilter({ ...selectedFilter, timing: e.target.value })}
        >
          <FormControlLabel value="All" control={<Radio />} label="All" />
          <FormControlLabel value="Launching soon" control={<Radio />} label="Launching soon" />
          <FormControlLabel value="Ending soon" control={<Radio />} label="Ending soon" />
          <FormControlLabel value="Just launched" control={<Radio />} label="Just launched" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Filters;
