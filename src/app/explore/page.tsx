"use client";
import React, { useState } from "react";
import { Box, TextField, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Filters from "../../components/generic/Filters";
import { CampaignCard } from "../../components/generic/CampaignCard";
import { NavigationLayout } from "layouts/NavigationLayout";

const campaigns = [
  {
    id: 1,
    title: "Math Angel",
    category: "Tech & Innovation",
    image: "/Home/pop4.webp",
    price: 703,
    discount: 9,
  },
  {
    id: 2,
    title: "Alien Horde",
    category: "Creative Works",
    image: "/Home/pop5.webp",
    price: 470,
    discount: 27,
  },
  {
    id: 3,
    title: "Community Solar Panels",
    category: "Community Projects",
    image: "/Home/pop6.webp",
    price: 500,
    discount: 15,
  },
];

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    category: "All Categories",
    timing: "All",
  });

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      (selectedFilter.category === "All Categories" ||
        campaign.category === selectedFilter.category) &&
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <NavigationLayout>
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          height: "300px",
          backgroundImage: "url(/Home/hero1.webp)", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)", // Optional for better readability
          }}
        >
          Explore it all
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack vertically on small screens
          gap: 3, // Add spacing between filter and grid
          p: 3,
        }}
      >
        {/* Sidebar Filters */}
        <Box
          sx={{
            flex: "1 0 25%", // Take 25% of the width
            maxWidth: "300px",
          }}
        >
          <Filters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </Box>

        {/* Campaign Grid */}
        <Box
          sx={{
            flex: "3 0 75%", // Take 75% of the width
          }}
        >
          {/* Search Bar */}
          <Box
            sx={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Search Input */}
            <TextField
                placeholder="Search for campaigns"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                fullWidth
                slotProps={{
                    input: {
                    startAdornment: (
                        <InputAdornment position="start">
                        <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                        <InputAdornment
                        position="end"
                        onClick={() => setSearchQuery("")}
                        sx={{ cursor: "pointer" }}
                        >
                        ✖
                        </InputAdornment>
                    ),
                    },
                }}
            />

          </Box>

          {/* Campaign Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Responsive columns
              gap: 2, // Spacing between campaign cards
            }}
          >
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                img={campaign.image}
                name={campaign.title}
                amountRaised={campaign.price}
                campaignId={campaign.id.toString()}
                key={campaign.id}
                {...campaign}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </NavigationLayout>
  );
};

export default ExplorePage;
