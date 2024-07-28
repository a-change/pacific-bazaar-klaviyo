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
import React, {useEffect, useState} from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {List} from '@mui/icons-material';
import {Alert, Button, Card, CircularProgress, Grid, Table, TableBody, TableCell, TableRow} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//other libs
//contexts
import {CartItem} from '@/contexts/AppContext';
//hooks
//hocs
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
//components
import Address from '@/components/cart/utils/Address';
import {CartItemCard} from '@/components/cart/templates/CartItem';
import {FlexBox} from '@/components/common/flex-box';
import {H3} from '@/components/common/bazaar/Typography';
//types
//functions
import {getUrl} from '@/utils/UrlUtils';
import {sessionService} from '@/utils/SessionService';
import {formattedPrice} from '@/utils/CurrencyUtils';

interface OrderProps {
  orderID: string;
}

function OrderBase(props: BrProps & OrderProps & GtmEventProps) {
  const {page, orderID, setGtmEventOrder} = props;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {t} = useTranslation('cart');

  useEffect(() => {
    const order = sessionService
      .readCompletedOrdersFromSession()
      ?.find((order) => order.id === orderID);
    setOrder(order);
    setGtmEventOrder(order);

    setLoading(false);
  }, [orderID]);// eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <CircularProgress></CircularProgress>;

  if (!order) {
    return <Alert severity='error'>{t('no-order')}</Alert>;
  }

  const {id, status, totalAmount, shipping, shipMethod, billing, taxAmount, items, date} = order;
  const locale = (typeof window !== 'undefined') && sessionStorage.getItem('locale').replace('_', '-');

  return (
    <Card sx={{p: 5, my: 3}}>
      <Grid container>
        <Grid item xs={8}>
          <h2>{t('order-details')}</h2>
        </Grid>
        <Grid item xs={4}>
          <FlexBox justifyContent={'flex-end'}>
            <Button
              color={'primary'}
              onClick={() => router.push(getUrl('/profile?active=my-orders', page))}
            >
              <List /> {t('order-list')}
            </Button>
          </FlexBox>
        </Grid>

        <Grid item xs={12}>
          <Table className={'mt-3'}>
            <TableBody>
              <TableRow>
                <TableCell sx={{fontWeight: 600}}>ID</TableCell>
                <TableCell>{id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{fontWeight: 600}}>{t('creation-date')}</TableCell>
                <TableCell>{new Date(date).toLocaleString(locale)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{fontWeight: 600}}>{t('shipping-address')}</TableCell>
                <TableCell>
                  <Address address={shipping} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{fontWeight: 600}}>{t('status')}</TableCell>
                <TableCell sx={{textTransform: 'uppercase'}}>{t(status.toLowerCase())}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{fontWeight: 600}}>{t('total-amount')}</TableCell>
                <TableCell>{formattedPrice(totalAmount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{fontWeight: 600}}>{t('billing-address')}</TableCell>
                <TableCell>
                  <Address address={billing} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{fontWeight: 600}}>{t('tax-amount')}</TableCell>
                <TableCell>{formattedPrice(taxAmount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={8} md={6} sx={{my: 2}}>
          <H3 sx={{mb: 1}}>{t('order-items')}</H3>

          {items &&
            items.map((orderItem: CartItem, key) => {
              return <CartItemCard key={key} {...orderItem} enabled={false} />;
            })}
        </Grid>
      </Grid>
    </Card>
  );
}

export const Order = withGtmEvent(OrderBase);

export const OrderComponent = (props: BrProps) => {
  const {page, component} = props;
  const router = useRouter();
  const orderID = router?.query?.route?.[1];

  if (!orderID) {
    return null;
  }

  return <Order orderID={orderID} page={page!} component={component!} />;
};
