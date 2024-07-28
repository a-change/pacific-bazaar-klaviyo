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
//next
import {useRouter} from 'next/router';
//mui
import {Button, Stack, Typography} from '@mui/material';
//components
import {H1} from '@/components/common/bazaar/Typography';

//Custom styled components

export const PageNotFoundComponent = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const backgroundImgStyle = {
    backgroundImage: 'url(/assets/imgs/common/404.svg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    height: '60vh',
    paddingLeft: '8px',
  };

  return (
    <Stack direction={'column'} spacing={2} justifyContent={'center'} sx={backgroundImgStyle}>
      <H1>Page not found</H1>
      <Typography>Oops! Looks like you followed a bad link.</Typography>
      <Typography>If you think this is a problem with us, please <a href='mailto:sales@bloomreach.com'>tell
        us</a>.</Typography>
      <Button size={'small'} color={'error'} variant={'contained'} onClick={handleGoBack} sx={{
        width: 'fit-content',
      }}>Go Back</Button>
    </Stack>
  );
};
