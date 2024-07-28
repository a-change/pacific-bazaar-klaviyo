/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//react
import {useContext, useEffect, useState} from 'react';
//next
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
//mui
import {Person} from '@mui/icons-material';
import {Box, Button, Card, Grid, Theme, Typography, useMediaQuery} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {UserContext} from '@/contexts/UserContext';
//components
import TableRow from '@/components/common/bazaar/TableRow';
import {H3, H5, Small} from '@/components/common/bazaar/Typography';
import {FlexBetween, FlexBox} from '@/components/common/flex-box';
import UserDashboardHeader from '@/components/user-profile/UserDashboardHeader';
import Navigations from '@/components/user-profile/Navigations';
//functions
import {formattedPrice} from '@/utils/CurrencyUtils';
import {sessionService} from '@/utils/SessionService';

const ProfileOverview = (props: BrProps) => {
  const {page} = props;
  const userContext = useContext(UserContext)!;
  const {user} = userContext.userState;
  const downMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [orders, setOrders] = useState([]);
  const {t} = useTranslation('profile');

  useEffect(() => {
    const orders = sessionService.readCompletedOrdersFromSession() ?? [];
    setOrders(orders);
  }, []);

  const HEADER_LINK = (
    <Link href={'#'} passHref>
      <Button color='primary' sx={{px: 4, bgcolor: 'primary.light'}}>
        {t('edit-profile')}
      </Button>
    </Link>
  );

  const infoList = [
    {
      title: orders.length,
      subtitle: 'orders',
    },
  ];

  const TableRowItem = ({title, value}) => {
    return (
      <FlexBox flexDirection='column' p={1}>
        <Small color='grey.600' mb={0.5} textAlign='left'>
          {title}
        </Small>
        <span>{value}</span>
      </FlexBox>
    );
  };

  return (
    <>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        icon={Person}
        title={t('my-profile')}
        button={HEADER_LINK}
        navigation={<Navigations page={page!} />}
      />

      {/* USER PROFILE INFO */}
      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Card
              sx={{
                display: 'flex',
                p: '14px 32px',
                height: '100%',
                alignItems: 'center',
              }}
            >
              <Box ml={1.5} flex='1 1 0'>
                <FlexBetween flexWrap='wrap'>
                  <div>
                    <H5 my='0px'>{`${user.firstName} ${user.lastName}`}</H5>
                    {/*<FlexBox alignItems='center'>
                      <Typography color='grey.600'>{t('balance')}:</Typography>
                      <Typography ml={0.5} color='primary.main'>
                        {formattedPrice(500)}
                      </Typography>
                    </FlexBox>*/}
                  </div>

                  <Typography color='grey.600' letterSpacing='0.2em'>
                    {t('silver-user')}
                  </Typography>
                </FlexBetween>
              </Box>
            </Card>
          </Grid>

          <Grid item md={6} xs={12}>
            <Grid container spacing={4}>
              {infoList.map((item) => (
                <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      p: '1rem 1.25rem',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <H3 color='primary.main' my={0} fontWeight={600}>
                      {item.title}
                    </H3>

                    <Small color='grey.600' textAlign='center'>
                      {t(item.subtitle)}
                    </Small>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <TableRow
        sx={{
          cursor: 'auto',
          p: '0.75rem 1.5rem',
          ...(downMd && {
            alignItems: 'start',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }),
        }}
      >
        <TableRowItem title={t('first-name')} value={user.firstName ?? ''} />
        <TableRowItem title={t('last-name')} value={user.lastName ?? ''} />
        <TableRowItem title={t('email')} value={user.email ?? ''} />
      </TableRow>
    </>
  );
};

export default ProfileOverview;
