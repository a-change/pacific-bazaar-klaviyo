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
import {useTranslation} from 'next-i18next';
//next
import {useSearchParams} from 'next/navigation';
import {useRouter} from 'next/router';
//mui
import {FormControl, FormControlLabel, FormGroup, IconButton, styled, Switch} from '@mui/material';
import Drawer from '@mui/material/Drawer';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//components
import {FlexBox} from '@/components/common/flex-box';
import {H3} from '@/components/common/bazaar/Typography';
//functions
import {
  get2DigitUidFromBinary,
  get2DigitUidFromUID,
  getCookie,
  getReplacedCookie,
  getUidFromCookie,
  setCookie,
} from './DiscoveryHelperUtils';
import {UID_COOKIE_NAME} from '@/hocs/HocUtils';
import {QUERY_PARAM_SWITCHBOARD} from '@/utils/SearchUtil';
import ClearIcon from '@mui/icons-material/Clear';

//Custom styled components
const SorterFormControlLabel = styled(FormControlLabel)(({theme}) => ({
  margin: '1rem 0',
}));

export const SWITCHBOARD_COOKIE_NAME = 'switchboard-session-control';

export interface DiscoveryHelperProps {
  setShowBody: React.Dispatch<React.SetStateAction<boolean>>,
}

export const DiscoveryHelper = (props: BrProps & DiscoveryHelperProps) => {
  const {setShowBody} = props;

  const searchParams = useSearchParams();
  const router = useRouter();
  const {t} = useTranslation('product');

  const [open, setOpen] = useState(searchParams.has(QUERY_PARAM_SWITCHBOARD));

  const initState = {
    full: false,
    none: false,
    semanticSearch: false,
    performanceRanking: false,
  };

  const [state, setState] = useState(initState);

  const loadToggles = () => {
    let switchboardSession = getCookie(SWITCHBOARD_COOKIE_NAME);
    if (switchboardSession !== '') {
      const urlParams = new URLSearchParams(
        searchParams.entries() as unknown as Record<string, string>,
      );
      let originalUID = getUidFromCookie(urlParams.get(UID_COOKIE_NAME) || getCookie(UID_COOKIE_NAME));
      const twoDigitNumber = get2DigitUidFromUID(originalUID);

      if (twoDigitNumber != null) {
        const updatedState = {...initState};
        const binaryNumber = twoDigitNumber.toString(2);

        // 1111, 1100, 1000, 0
        const binaryNumberVal = parseInt(binaryNumber);
        if (binaryNumberVal === 1100011) {
          updatedState['full'] = true;
        } else if (binaryNumberVal === 10) {
          updatedState['performanceRanking'] = true;
        } else if (binaryNumberVal === 1) {
          updatedState['semanticSearch'] = true;
        }
        if (binaryNumberVal === 0) {
          updatedState['none'] = true;
        }

        setState(updatedState);
      }
    } else {
      setCookie(SWITCHBOARD_COOKIE_NAME, 'true', 0.02);
    }
  };

  const onClickSwitch = (item: string) => {
    let updatedState = {...initState};
    updatedState[item] = true;

    let searchBinNumber = 0;

    if (updatedState.performanceRanking) {
      searchBinNumber = 10;
    }
    if (updatedState.semanticSearch) {
      searchBinNumber = 1;
    }
    if (updatedState.none) {
      searchBinNumber = 0;
    }
    if (updatedState.full) {
      searchBinNumber = 1100011;
    }

    let digitUID = get2DigitUidFromBinary(searchBinNumber.toString());
    let originalUID = getUidFromCookie(getCookie(UID_COOKIE_NAME));
    let newUID = getReplacedCookie(getUidFromCookie(getCookie(UID_COOKIE_NAME)), digitUID)!;
    let originalCookieValue = getCookie(UID_COOKIE_NAME);
    let updatedCookieValue = originalCookieValue.replace(originalUID, newUID);

    // Per Albert's Note
    if (updatedState.performanceRanking) {
      updatedCookieValue = 'uid=3887804411002:v=12.0:ts=1559140374393:hc=263';
    }
    if (updatedState.semanticSearch) {
      updatedCookieValue = 'uid=3887804411001:v=12.0:ts=1559140374393:hc=263';
    }
    if (updatedState.none) {
      updatedCookieValue = 'uid=3887804411000:v=12.0:ts=1559140374393:hc=263';
    }
    if (updatedState.full) {
      updatedCookieValue = 'uid=3887804411099:v=12.0:ts=1559140374393:hc=263';
    }
    setCookie(UID_COOKIE_NAME, updatedCookieValue, 100 * 365);     // update the cookie

    setState(updatedState);

    router.reload();
  };

  useEffect(() => {
    loadToggles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {full, none, semanticSearch, performanceRanking} = state;

  return (
    <FlexBox alignItems='center' my='0.25rem'>
      <FormControlLabel
        control={<Switch color='info' checked={open} onChange={() => {
          setOpen(!open);
          setShowBody(false);

          const urlParams = new URLSearchParams(
            searchParams.entries() as unknown as Record<string, string>,
          );
          urlParams.set(QUERY_PARAM_SWITCHBOARD, 'on');
          router.push(`${router.pathname}?${urlParams}`);
        }} size='small' />}
        label={'Intelligence Switchboard'} />
      <Drawer
        anchor={'bottom'}
        open={open}
        variant={open ? 'permanent' : 'temporary'}
        onClose={() => setOpen(false)}
      >
        <FlexBox flexDirection={'column'} sx={{
          padding: '2rem',
          minWidth: '200px',
        }}>
          <H3>{t('intelligence-switchboard')} <IconButton size={'small'} onClick={() => {
            setOpen(false);
            const urlParams = new URLSearchParams(
              searchParams.entries() as unknown as Record<string, string>,
            );
            if (urlParams.has(QUERY_PARAM_SWITCHBOARD)) {
              urlParams.delete(QUERY_PARAM_SWITCHBOARD);
              router.push(`${router.pathname}?${urlParams}`);
            }
          }}><ClearIcon /></IconButton></H3>
          <FormControl component='fieldset' variant='standard'>
            <FormGroup>
              {Object.keys(initState).map((item, key) => (
                <SorterFormControlLabel
                  key={key}
                  control={<Switch color='info' checked={state[item]} onChange={() => {
                    onClickSwitch(item);
                  }} size='small' />}
                  label={t(`switchboard-${item}`)} />
              ))}
            </FormGroup>
          </FormControl>
        </FlexBox>
      </Drawer>
    </FlexBox>
  );
};