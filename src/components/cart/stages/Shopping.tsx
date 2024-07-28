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

//mui
import {Grid} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//contexts
import {CartItem, useAppContext} from 'contexts/AppContext';
//types
import {StageInputProps} from '../CartComponentTypes';
//templates
import {CartItemCard} from '../templates/CartItem';

export const Shopping = (props: BrProps & StageInputProps) => {
  const {stage, setStage} = props;
  const {state} = useAppContext();
  const cartList: CartItem[] = state.cart;

  const CartProduct = (props: CartItem) => {
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* CART PRODUCT LIST */}
        <Grid item md={8} xs={12}>
          {cartList.map((item, key) => (
            <CartItemCard key={key} {...item} stage={stage} setStage={setStage} />
          ))}
        </Grid>
      </Grid>
    </>
  );
};
