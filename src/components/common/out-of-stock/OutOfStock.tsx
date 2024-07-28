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
import {Box, Button, Container, Grid} from '@mui/material';

export interface OutOfStockProps {
  productId?: string,
}

export const OutOfStock = ({productId}: OutOfStockProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const backgroundImgStyle = {
    backgroundImage: 'url("/assets/imgs/common/404.svg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  };

  return (
    <Box sx={backgroundImgStyle}>
      <Container>
        <Grid container>
          <Grid item>
            <h1 className='header'>Out of Stock</h1>
            <p>Oops! Sorry, this product {productId} is currently out of stock.</p>
            <p>Please check out similar products below that are currently available.</p>
            <Button variant={'contained'} color={'primary'} onClick={handleGoBack}>Go Back</Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
