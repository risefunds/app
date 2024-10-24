'use client'

import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, MenuItem, Grid,
  FormControl, InputLabel, Select, Card, CardContent
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const StartCampaign = () => {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignTagline, setCampaignTagline] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [campaignQuestion, setCampaignQuestion] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3, maxWidth: '800px', mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Start a New Campaign
          </Typography>

          <TextField
            label="Campaign Title"
            variant="outlined"
            fullWidth
            value={campaignTitle}
            onChange={(e) => setCampaignTitle(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Campaign Tagline"
            variant="outlined"
            fullWidth
            value={campaignTagline}
            onChange={(e) => setCampaignTagline(e.target.value)}
            margin="normal"
          />

          <Box mt={2} mb={2}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
            >
              Upload Image
              <input type="file" hidden />
            </Button>
          </Box>

          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as string)}
              label="Category"
            >
              <MenuItem value="Non-profit">Non-profit</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Tags"
            variant="outlined"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
            helperText="Separate tags with commas"
          />

          <TextField
            label="Campaign Question"
            variant="outlined"
            fullWidth
            value={campaignQuestion}
            onChange={(e) => setCampaignQuestion(e.target.value)}
            margin="normal"
            helperText="What is the main objective of your campaign?"
          />

          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save & Continue
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StartCampaign;  