import React, { useEffect, useState } from 'react';
import { Layout } from './Layout';
import { useRouter } from 'next/navigation';
import { useAuth } from 'hooks/useAuth';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { LogoGraphic } from 'components/Graphics/LogoGraphic';

const pages = ['aboutUs', 'contactUs']; 
const settings = ['Profile', 'Campaign', 'Logout'];

export interface INavigationLayoutProps {
  noUserSettings?: boolean;
  children?: React.ReactNode;
}

const buttonStyles = {
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
};

export const NavigationLayout: React.FC<INavigationLayoutProps> = ({
  noUserSettings = false,
  ...props
}) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const { user, appContext } = useAuth();
  const router = useRouter();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (appContext.helper.isSU && !settings.includes('SU')) {
      settings.splice(2, 0, 'SU');
    }
  }, [appContext.helper.isSU]);

  return (
    <>
      <Layout>
        <AppBar position="static" color="secondary">
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ height: '90px' }}>
              <Link
                href="/"
                passHref
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LogoGraphic />
                </Box>
              </Link>

              {/* Mobile Menu */}
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: 'block', md: 'none' } }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu();
                        router.push(`/${page}`);
                      }}
                    >
                      <Typography sx={{ textAlign: 'center' }}>
                        {page.replace('Us', ' Us')}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Desktop Menu */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => router.push(`/${page}`)}
                    sx={{
                      my: 2,
                      color: 'secondary.contrastText',
                      display: 'block',
                      fontSize: '1.2rem',
                    }}
                  >
                    {page.replace('Us', ' Us')}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                {!user ? (
                  <Stack spacing={2} direction="row">
                    <Button
                      variant="outlined"
                      sx={buttonStyles}
                      onClick={() => router.push('/auth/login')}
                    >
                      Log in
                    </Button>
                    <Button
                      variant="contained"
                      sx={buttonStyles}
                      onClick={() => router.push('/auth/signup')}
                    >
                      Sign Up
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={2} direction="row">
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.email[0].toUpperCase()}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem
                          key={setting}
                          onClick={async () => {
                            if (setting === 'Logout') {
                              await appContext.helper.signOut();
                              router.push('/');
                            } else if (setting === 'SU') {
                              router.push('/user/su/creative');
                            } else if (setting === 'Campaign') {
                              router.push('/user/campaign');
                            } else {
                              router.push(
                                `/user/dashboard/${setting.toLowerCase()}`,
                                undefined,
                              );
                            }
                            handleCloseUserMenu();
                          }}
                        >
                          <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                    <Button
                      variant="contained"
                      sx={buttonStyles}
                      onClick={() => router.push('/user/campaign')}
                    >
                      Start a Campaign
                    </Button>
                  </Stack>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        {props.children}
      </Layout>
    </>
  );
};
