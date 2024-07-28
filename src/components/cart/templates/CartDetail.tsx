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
//mui
import {Container} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {useAppContext} from '@/contexts/AppContext';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//hocs
import {GtmEventProps, withGtmEvent} from '@/hocs/gtm/GtmEventHoc';
//components
import {FlexBox} from '@/components/common/flex-box';
//types
//functions
import {getUrl} from '@/utils/UrlUtils';
import {sessionService} from '@/utils/SessionService';
import {CartMock} from '@/../mocks/data/UserCartOrderMocks';
//templates
import {Billing, Purchase, Shopping} from '../stages';
import {CartMenu, EmptyCart} from '.';

export enum CartStageEnum {
  SHOPPING = 'SHOPPING',
  BILLING = 'BILLING',
  PURCHASE = 'PURCHASE',
  FINISH = 'FINISH',
}

function CartDetailBase(props: BrProps & GtmEventProps) {
  const {page, component, setGtmEventOrder} = props;
  const width = useWindowSize();
  const router = useRouter();
  const {state, dispatch} = useAppContext();
  const cart = state.cart;

  const orderDetails = sessionService.readOrderFromSession();

  function getInitialStage(): CartStageEnum {
    const orderDetails = sessionService.readOrderFromSession();
    let initialStage = CartStageEnum.SHOPPING;
    if (orderDetails) {
      initialStage = CartStageEnum.BILLING;
      if (orderDetails.shipMethod) {
        initialStage = CartStageEnum.PURCHASE;
        if (orderDetails.draft === false) {
          initialStage = CartStageEnum.FINISH;
        }
      }
    }
    return initialStage;
  }

  const [stage, setStage] = useState<CartStageEnum>(CartStageEnum.SHOPPING);

  useEffect(() => {
    const initialStage = getInitialStage();
    if (stage === CartStageEnum.FINISH) {
      const completedOrder = {
        ...orderDetails,
        status: 'COMPLETED',
        id: CartMock().id,
        date: new Date(),
      };
      sessionService.saveCompletedOrderToSession(completedOrder);
      dispatch({type: 'CLEAR_CART', payload: null});
      sessionService.saveOrderToSession(undefined);
      router.push(getUrl('/orders/' + completedOrder.id, page!));
    }
    setStage(initialStage);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log(cart);
  if (cart.length === 0) {
    return <EmptyCart />;
  }

  const renderStage = () => {
    const stageParams = {
      page: page!,
      component,
      stage,
      setStage,
    };
    switch (stage) {
      case CartStageEnum.SHOPPING:
        return <Shopping {...{...stageParams, ...{cartDetailsFetched: cart}}} />;
      case CartStageEnum.BILLING:
        return <Billing {...stageParams} />;
      case CartStageEnum.PURCHASE:
        return <Purchase {...stageParams} />;
      default:
        return null;
    }
  };

  return (
    <FlexBox flexDirection={width > 650 ? 'row' : 'column'} className={'cart'} p={2}>
      <Container sx={{mw: '65vw'}}>{renderStage()}</Container>

      <CartMenu stage={stage} setStage={setStage} />
    </FlexBox>
  );
}

export const CartDetail = withGtmEvent(CartDetailBase);
