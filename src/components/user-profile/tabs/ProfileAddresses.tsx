import {BrProps} from '@bloomreach/react-sdk';
import React, {useMemo} from 'react';
import Link from 'next/link';
import {useState} from 'react';
import {GetStaticProps, NextPage} from 'next';
import {Delete, Edit, Place} from '@mui/icons-material';
import {Button, IconButton, Pagination, Typography} from '@mui/material';
import TableRow from '@/components/common/bazaar/TableRow';
import {FlexBox} from '@/components/common/flex-box';
import UserDashboardHeader from './UserDashboardHeader';
import CustomerDashboardNavigation from './Navigations';
import {AddressGroupMock} from '../../../../mocks/data/UserCartOrderMocks';

const ProfileAddresses = (props: BrProps) => {
  const [allAddress, setAllAddress] = useState(AddressGroupMock.addresses);
  const [pageNum, setPageNum] = useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNum(value);
  };
  const slice = useMemo(() => {
    const start = 1 + (pageNum - 1) * 5;
    const end = start + 5 > allAddress.length ? undefined : start + 5;
    return {start: start, end: end};
  }, [pageNum, allAddress.length]);

  // SECTION TITLE HEADER BUTTON
  const HEADER_BUTTON = (
    <Button color='primary' sx={{bgcolor: 'primary.light', px: 4}}>
      Add New Address
    </Button>
  );

  // HANDLE ADDRESS DELETE
  const handleAddressDelete = (id: string) => {
    setAllAddress(allAddress.filter((item) => item.id !== id));
  };
  // console.log(allAddress.slice(slice.start, slice.end));
  return (
    <>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        icon={Place}
        title='My Addresses'
        button={HEADER_BUTTON}
        navigation={<CustomerDashboardNavigation />}
      />

      {/* ALL ADDRESS LIST AREA */}
      {allAddress.slice(slice.start, slice.end).map((address) => (
        <TableRow sx={{my: 2, padding: '6px 18px'}} key={address.id}>
          <Typography whiteSpace='pre' m={0.75} textAlign='left' sx={{fontWeight: '700'}}>
            {`${address.firstName ?? ''} ${address.lastName ?? ''}`}
          </Typography>

          <Typography flex='1 1 260px !important' m={0.75} textAlign='left'>
            {`${address.streetAddress}, ${address.city}, ${address.state} ${address.postalCode} ${address.country}`}
          </Typography>

          <Typography whiteSpace='pre' m={0.75} textAlign='left'></Typography>

          <Typography whiteSpace='pre' textAlign='center' color='grey.600'>
            {/* <Link href={`#`} passHref>
              <IconButton>
                <Edit fontSize='small' color='inherit' />
              </IconButton>
            </Link> */}

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleAddressDelete(address.id);
              }}
            >
              <Delete fontSize='small' color='inherit' />
            </IconButton>
          </Typography>
        </TableRow>
      ))}

      {/* PAGINATION AREA */}
      <FlexBox justifyContent='center' mt={5}>
        <Pagination
          count={Math.ceil(allAddress.length / 5)}
          onChange={handleChange}
          page={pageNum}
        />
      </FlexBox>
    </>
  );
};

export default ProfileAddresses;
