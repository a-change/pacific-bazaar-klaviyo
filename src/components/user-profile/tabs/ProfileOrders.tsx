import {sessionService} from '@/utils/SessionService';
import {BrProps} from '@bloomreach/react-sdk';
import {ShoppingBag} from '@mui/icons-material';
import {CircularProgress, Pagination} from '@mui/material';
import TableRow from '@/components/common/bazaar/TableRow';
import {H5} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
import UserDashboardHeader from './UserDashboardHeader';
import CustomerDashboardNavigation from './Navigations';
import OrderRow from './OrderRow';
import React, {useEffect, useMemo, useState} from 'react';

const ProfileOrders = (props: BrProps) => {
  const {page} = props;
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    setAllOrders(sessionService.readCompletedOrdersFromSession() ?? []);
    setLoading(false);
  }, []);

  const [pageNum, setPageNum] = useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNum(value);
  };

  const slice = useMemo(() => {
    const start = 1 + (pageNum - 1) * 5;
    const end = start + 5 > allOrders.length ? undefined : start + 5;
    return {start: start, end: end};
  }, [pageNum, allOrders.length]);

  return (
    <>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        title='My Orders'
        icon={ShoppingBag}
        navigation={<CustomerDashboardNavigation />}
      />

      {/* ORDER LIST AREA */}
      <TableRow
        elevation={0}
        sx={{
          padding: '0px 18px',
          background: 'none',
          display: {xs: 'none', md: 'flex'},
        }}
      >
        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Order #
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Status
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Date purchased
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Total
        </H5>

        <H5
          my={0}
          px={2.75}
          color='grey.600'
          flex='0 0 0 !important'
          display={{xs: 'none', md: 'block'}}
        />
      </TableRow>

      {allOrders.length ? (
        allOrders.map((order) => <OrderRow order={order} key={order.id} page={page!} />)
      ) : loading ? (
        <CircularProgress />
      ) : (
        <H5 px={2.75} py={2}>
          No past orders have been found for this profile.
        </H5>
      )}

      <FlexBox justifyContent='center' mt={5}>
        <Pagination
          count={Math.ceil(allOrders.length / 5)}
          color='primary'
          variant='outlined'
          onChange={handleChange}
          page={pageNum}
        />
      </FlexBox>
    </>
  );
};

export default ProfileOrders;
