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
import React, {useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Button, Card, Divider, Grid} from '@mui/material';
//contexts
import {CartItem, useAppContext} from '@/contexts/AppContext';
//components
import {Span} from '@/components/common/typography/Typography';
import {FlexBetween, FlexBox} from '@/components/common/flex-box';
//types
import {StageInputProps} from '../CartComponentTypes';
//functions
import {sessionService} from '@/utils/SessionService';
import {formattedPrice} from '@/utils/CurrencyUtils';
//templates
import {CartStageEnum} from './CartDetail';

export const CartMenu = (props: StageInputProps) => {
  const {stage, setStage} = props;
  const [orderDetails, setOrderDetails] = useState(sessionService.readOrderFromSession() ?? {});
  const {totalAmount, taxAmount, shipping, billing, shipMethod} = orderDetails;
  const {t} = useTranslation('cart');

  console.log(orderDetails);
  const {state} = useAppContext();
  const cartList: CartItem[] = state.cart;

  const getTotalPrice = () => cartList.reduce((accum, item) => accum + item.price * item.qty, 0);

  const nextStep = () => {
    switch (stage) {
      case CartStageEnum.SHOPPING:
        return {text: t('checkout'), stage: CartStageEnum.BILLING, previous: null};
      case CartStageEnum.BILLING:
        return {text: t('review'), stage: CartStageEnum.PURCHASE, previous: CartStageEnum.SHOPPING};
      case CartStageEnum.PURCHASE:
        return {text: t('place-order'), stage: CartStageEnum.FINISH, previous: CartStageEnum.BILLING};
      case CartStageEnum.FINISH:
        return null;
      default:
        return null;
    }
  };
  if (!nextStep()) return <></>;
  return (
    <Grid item md={4} xs={3}>
      <Card sx={{padding: 2}}>
        <h4>{t('order-summary')}</h4>
        <Divider sx={{mb: 2}} />
        <FlexBetween mb={2}>
          <Span color='grey.600'>{t('total')}:</Span>

          <Span fontSize={18} fontWeight={600} lineHeight='1'>
            {formattedPrice(getTotalPrice(), 2)}
          </Span>
        </FlexBetween>
        {taxAmount && (
          <FlexBetween mb={2}>
            <Span color='grey.600'>{t('tax')}:</Span>

            <Span fontSize={14} fontWeight={600} lineHeight='1'>
              {formattedPrice(taxAmount)}
            </Span>
          </FlexBetween>
        )}

        {shipMethod && (
          <FlexBetween mb={2}>
            <Span color='grey.600'>{t('delivery')}:</Span>

            <Span fontSize={14} fontWeight={600} lineHeight='1'>
              {shipMethod}
            </Span>
          </FlexBetween>
        )}

        {billing && (
          <FlexBox flexDirection={'column'} mb={2}>
            <Span color='grey.600'>{t('billing')}:</Span>
            <Span fontSize={14} fontWeight={600} lineHeight='1' textAlign={'end'}>
              {billing.name}{' '}
            </Span>
            <Span fontSize={14} fontWeight={500} lineHeight='1' textAlign={'end'}>
              {billing.address1} {billing.zip}
            </Span>
            <Span fontSize={14} fontWeight={500} lineHeight='1' textAlign={'end'}>
              {billing.country}
            </Span>
          </FlexBox>
        )}
        {shipping && (
          <FlexBox flexDirection={'column'} mb={2}>
            <Span color='grey.600'>{t('shipping')}:</Span>
            <Span fontSize={14} fontWeight={600} lineHeight='1' textAlign={'end'}>
              {shipping.name}{' '}
            </Span>
            <Span fontSize={14} fontWeight={500} lineHeight='1' textAlign={'end'}>
              {shipping.address1} {shipping.zip}
            </Span>
            <Span fontSize={14} fontWeight={500} lineHeight='1' textAlign={'end'}>
              {shipping.country}
            </Span>
          </FlexBox>
        )}

        <Divider sx={{mb: 2}} />

        {nextStep().stage == CartStageEnum.BILLING && (
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={() => {
              sessionService.saveOrderToSession({...orderDetails, draft: true});
              setStage(nextStep().stage);
            }}
          >
            {nextStep().text}
          </Button>
        )}

        {nextStep().previous && (
          <>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={() => setStage(nextStep().previous)}
            >
              {t('go-back')}
            </Button>
          </>
        )}

        {stage == CartStageEnum.PURCHASE && (
          <>
            <Divider sx={{mb: 2}} />

            <Button
              variant='contained'
              color='primary'
              sx={{color: 'white', backgroundColor: 'rgba(122, 0, 0, 0.7)'}}
              fullWidth
              onClick={() => {
                setStage(nextStep().stage);
              }}
            >
              {nextStep().text}
            </Button>
          </>
        )}
      </Card>
    </Grid>
  );
};
