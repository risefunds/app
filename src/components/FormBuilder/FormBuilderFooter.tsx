import React, { ReactElement } from 'react';
import { Box, Grid, Icon } from '@mui/material';
import { GenericButton } from 'components/generic/Button';
import { ArrowRightAlt } from '@mui/icons-material';
import { IFormBuilderStep } from './types';

interface IFormBuilderFooterProps {
  step: IFormBuilderStep<any>;
  isValid: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  onBack?: Function;
  getValues: Function;
  isSubmitDefined: boolean;
}
const FormBuilderFooter: React.FC<IFormBuilderFooterProps> = (props) => {
  return (
    <Grid container justifyContent={'space-between'} alignItems="center">
      {props.isSubmitDefined && (
        <Grid item xs={12}>
          <GenericButton
            type="submit"
            color="primary"
            variant="contained"
            size="medium"
            fullWidth={props.step.footerSubmitButtonFullWidth ?? true}
            disabled={props.isValid}
            loading={props.isSubmitting}
            endIcon={props.step.footerSubmitIcon || <ArrowRightAlt />}
          >
            {props.isLastStep ? props.step.footerSubmitTitle || 'Save' : 'Next'}
          </GenericButton>
        </Grid>
      )}
      {props.onBack && (
        <Grid item>
          <GenericButton
            sx={{ mt: 2 }}
            onClick={() => props.onBack?.()}
            variant="text"
          >
            Go Back?
          </GenericButton>
        </Grid>
      )}
    </Grid>
  );
};

export default FormBuilderFooter;
