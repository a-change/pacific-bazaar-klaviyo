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
import React from 'react';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//templates
import {Shopping} from './Shopping';
//types
import {StageInputProps} from '../CartComponentTypes';
//functions
import {sessionService} from '@/utils/SessionService';
//contexts
import {useAppContext} from '@/contexts/AppContext';

export const Purchase = (props: BrProps & StageInputProps) => {
  const {
    stage,
    setStage,
  } = props;
  const {state} = useAppContext();
  const cart = state.cart;
  const order = sessionService.readOrderFromSession();
  return (
    <>
      <Shopping {...{...{setStage, stage}, ...{cartDetailsFetched: cart}}} />
    </>
  );
};
