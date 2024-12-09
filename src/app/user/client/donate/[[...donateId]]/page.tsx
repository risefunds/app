'use client';
import { MailOutline } from '@mui/icons-material';
import {
  Box,
  Container,
  ListItemText,
  Typography,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { models } from '@risefunds/sdk';
import { AppContext } from 'context/AppContext';
import { GenericButton } from 'components/generic/Button';
import { DonationInformation } from 'components/Donation/DonationInformation';
import { NavigationLayout } from 'layouts/NavigationLayout';
import _ from 'lodash';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

interface IDonationItemProps {}

const DonationItem: React.FC<IDonationItemProps> = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<
    models.DonationEntityModel | undefined
  >(undefined);
  const appContext = useContext(AppContext);
  const jwt = searchParams.get('jwt') as string;
  const uid = searchParams.get('uid') as string;
  //   const donationId = router.query.donationId?.[0];
  const donationId = useParams().donateId?.[0];
  //   const donationId = searchParams.get('donateId');
  console.log({ donationId });

  useEffect(() => {
    const authenticate = async (customToken: string) => {
      await appContext.helper.signInWithCustomToken(customToken);
    };

    const getDonation = async (donationId: string) => {
      if (appContext.sdkServices) {
        appContext.sdkServices.base.backendService.getAuthorization =
          async () => {
            return {
              jwt: jwt || '',
              uid: uid || '',
            };
          };
        const donationFetched =
          await appContext.sdkServices.core.DonationEntityService.get(
            donationId,
            { noHooks: false },
          );

        setDonation(donationFetched);
      }
    };

    const fetchInitialData = async () => {
      if (jwt) {
        if (!appContext.helper.firebaseUser) {
          await authenticate(jwt);
        }
      }
      if (donationId) await getDonation(donationId);
      setLoading(false);
    };

    if (searchParams.get('n3Code')) {
      fetchInitialData();
    }
  }, [searchParams]);

  if (loading) {
    return <LinearProgress />;
  }

  if (!donation) {
    return <>404</>;
  }

  return (
    <>
      <NavigationLayout>
        <Container maxWidth="lg" sx={{ mt: 3, mb: 12 }}>
          <Grid container justifyContent="center">
            <Grid size={{ md: 4 }}>
              <Box mb={3}>
                <Typography variant="subtitle1">
                  Hello {appContext.helper.platformUser?.name},
                </Typography>
              </Box>
              <DonationInformation donation={donation} jwt={jwt} />
              <Box mt={3}>
                <Grid
                  container
                  alignItems={'flex-end'}
                  justifyContent="space-between"
                >
                  <Grid>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'body1' }}
                      secondaryTypographyProps={{ variant: 'body2' }}
                      primary="How can we help?"
                      secondary="Write to our founders, Uyioghosa, Sonam and Arvinder."
                    />
                    <GenericButton
                      size="small"
                      sx={{ mt: 2 }}
                      startIcon={<MailOutline />}
                      variant="outlined"
                      href="mailto:uiyekekpolo7079@conestogac.on.ca?subject=chat"
                    >
                      Chat with us
                    </GenericButton>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </NavigationLayout>
    </>
  );
};

export default DonationItem;
