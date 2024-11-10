import React, { useState, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Link as MUILink,
  MenuList,
} from '@mui/material';
import { models } from '@risefunds/sdk';
import { Link, Mail, MoreVert, Visibility, Check } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { handleVerifyRevalidate } from 'server/serverActions';

export const CreativeActionDropdown: React.FC<
  GridRenderCellParams<any, models.CreativeUserEntityModel, any>
> = (props) => {
  const appContext = useContext(AppContext);
  const creativeUser: models.CreativeUserEntityModel = props.row;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const email = props.row?.email;
  const profileCompletion = creativeUser?.portoflioPercentage;
  const isVerified = creativeUser?.isVerified;
  const website = creativeUser.details?.website;

  const router = useRouter();

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuList disablePadding dense>
          {email && (
            <>
              <MenuItem
                onClick={async () => {
                  try {
                    appContext.helper.showSuccess(
                      "Email Scheduled. Please wait whilst it's being sent...",
                    );
                    const response =
                      await appContext.sdkServices?.base.backendService.request<{
                        message: string;
                      }>(
                        '/pub/addon/entity/CreativeUser/sendProfileCompletedEmail',
                        { creativeId: props.row.id },
                      );
                    if (!response) throw new Error('Not implemented');
                    appContext.helper.showSuccess(response.message);
                  } catch (error) {
                    appContext.helper.showError((error as Error).message);
                  }
                }}
              >
                <ListItemIcon>
                  <Check color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile Completed Email</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  try {
                    appContext.helper.showSuccess(
                      "Email Scheduled. Please wait whilst it's being sent...",
                    );
                    const response =
                      await appContext.sdkServices?.base.backendService.request<{
                        message: string;
                      }>(
                        '/pub/addon/entity/CreativeUser/sendProfileCompletionEmail',
                        { creativeId: props.row.id },
                      );
                    if (!response) throw new Error('Not implemented');
                    appContext.helper.showSuccess(response.message);
                  } catch (error) {
                    appContext.helper.showError((error as Error).message);
                  }
                }}
              >
                <ListItemIcon>
                  <Mail color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile Inactive Email</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  if (typeof window !== 'undefined') {
                    window.location.href = `mailto:${email}`;
                  }
                }}
              >
                <ListItemIcon>
                  <Mail fontSize="small" />
                </ListItemIcon>
                <ListItemText>Send Direct Email</ListItemText>
              </MenuItem>
            </>
          )}
          {profileCompletion > 85 && !isVerified && (
            <MenuItem
              onClick={async () => {
                try {
                  appContext.helper.showSuccess(
                    "Email Scheduled. Please wait whilst it's being sent...",
                  );

                  const response =
                    await appContext.sdkServices?.base.backendService.request<{
                      message: string;
                    }>('/pub/addon/entity/CreativeUser/sendVerificationEmail', {
                      creativeId: props.row.id,
                    });
                  console.log();
                  if (!response) throw new Error('Not implemented');
                  appContext.helper.showSuccess(response.message);
                  await handleVerifyRevalidate();
                  // appContext.helper.showSuccess(
                  //   'User Verification updated successfully',
                  // );
                } catch (error) {
                  appContext.helper.showError((error as Error).message);
                }
              }}
            >
              <ListItemIcon>
                <VerifiedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Verify</ListItemText>
            </MenuItem>
          )}
          {isVerified && (
            <MenuItem
              onClick={async () => {
                try {
                  creativeUser.isVerified = false;
                  await appContext.sdkServices?.core.CreativeUserEntityService.persist(
                    creativeUser,
                  );
                  await handleVerifyRevalidate();
                  appContext.helper.showSuccess(
                    'User Verification updated successfully',
                  );
                } catch (error) {
                  appContext.helper.showError((error as Error).message);
                }
              }}
            >
              <ListItemIcon>
                <NewReleasesIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Unverify</ListItemText>
            </MenuItem>
          )}
          {website && (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                if (typeof window !== 'undefined' && website) {
                  window.open(website, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <ListItemIcon>
                <Link fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Website</ListItemText>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              router.push(`/user/su/campaign/${props.row.id}`);
            }}
          >
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Campaigns</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>

      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVert fontSize="small" />
      </IconButton>
    </>
  );
};
