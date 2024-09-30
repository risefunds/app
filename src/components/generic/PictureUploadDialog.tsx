import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
} from '@mui/material';
import React, { useContext } from 'react';
import { GenericSingleImageContext } from 'components/GenericSingleImageContext';

interface IPictureUploadDialog {
  openConfirmationModal: boolean;
  tabId: string;
  handleClose: () => void;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  createNewProject: () => Promise<void>;
}

const PictureUploadDialog: React.FC<IPictureUploadDialog> = (props) => {
  const genericSingleImageContext = useContext(GenericSingleImageContext);
  const {
    openConfirmationModal,
    tabId,
    handleClose,
    setTab,
    createNewProject,
  } = props;
  return (
    <Dialog
      open={openConfirmationModal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'Leave page?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Leaving this page means you could lose data as upload is yet to be
          completed. Do you wish to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            if (tabId === 'createNewProject') {
              await createNewProject();
            } else {
              setTab(tabId);
            }
            genericSingleImageContext?.setLoading(false);
            handleClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PictureUploadDialog;
