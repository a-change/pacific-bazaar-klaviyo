import {UserContext} from '@/contexts/UserContext';
import {BrProps} from '@bloomreach/react-sdk';
import {Container, Grid, Theme, useMediaQuery} from '@mui/material';
import {useRouter} from 'next/router';
import {useContext} from 'react';
import Navigations from './Navigations';
import ProfileAddresses from './tabs/ProfileAddresses';
import ProfileOrders from './tabs/ProfileOrders';
import ProfileOverview from './tabs/ProfileOverview';

export const UserProfileComponent = (props: BrProps) => {
  const {page, component} = props;
  const userContext = useContext(UserContext)!;
  const router = useRouter();

  // SECTION TITLE HEADER LINK

  const renderProfileComponent = () => {
    const tab = router.query.active ?? 'overview';
    // console.log(router);
    switch (tab) {
      case 'overview':
        return <ProfileOverview page={page!} component={component!} {...props} />;
      case 'my-orders':
        return <ProfileOrders page={page!} component={component!} {...props} />;
      case 'addresses':
        return <ProfileAddresses page={page!} component={component!} {...props} />;
    }
  };

  return (
    <Container sx={{my: '2rem'}}>
      <Grid container spacing={3}>
        <Grid item lg={3} xs={12} sx={{display: {xs: 'none', sm: 'none', md: 'block'}}}>
          <Navigations page={page!} />
        </Grid>
        <Grid item lg={9} xs={12}>
          {renderProfileComponent()}
        </Grid>
      </Grid>
    </Container>
  );
};
