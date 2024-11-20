// pages/contact.tsx
import { Container, TextField, Button, Grid, Typography, Box } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const Contact = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: 5 }}>
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We'd love to hear from you. Fill out the form below to reach out.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Name Field */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
        </Grid>

        {/* Email Field */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
        </Grid>

        {/* Subject Field */}
        <Grid item xs={12}>
          <TextField
            label="Subject"
            variant="outlined"
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
        </Grid>

        {/* Message Field */}
        <Grid item xs={12}>
          <TextField
            label="Message"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            fullWidth
            sx={{ padding: '14px', fontSize: '1rem' }}
          >
            Send Message
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
