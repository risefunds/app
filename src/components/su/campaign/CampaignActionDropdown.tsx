import React, { useState, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { GridRenderCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
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

export const CampaignActionDropdown: React.FC<
  GridRenderCellParams<any, models.CreativeUserEntityModel, any>
> = (props) => {
  const appContext = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  return (
    <>
      <Menu
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuList disablePadding dense>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              router.push(
                `/user/su/creative/${props.row.getSingleParentMandatoryReference(
                  models.CreativeUserEntityModel.collection,
                )}`,
              );
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Creative</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              router.push(`/campaigns/${props.row.id}`);
            }}
          >
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Campaign</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              try {
                setAnchorEl(null);
                props.row.archive = true;
                await appContext.sdkServices?.core.CampaignEntityService.persist(
                  props.row,
                );
                appContext.helper.showSuccess(
                  'Campaign Archived successfully.',
                );
              } catch (error) {
                appContext.helper.showError('Campaign Archived failed.');
              }
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archive Campaign</ListItemText>
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
