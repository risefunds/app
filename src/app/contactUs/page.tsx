"use client";

import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";

const ContactUs: React.FC = () => {
  // Define form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on input
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { name: "", email: "", message: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Thank you for reaching out! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        We'd love to hear from you! Please fill out the form below, and we'll
        get back to you as soon as possible.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              required
              error={!!errors.message}
              helperText={errors.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ContactUs;
