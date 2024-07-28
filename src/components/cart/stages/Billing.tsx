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
import {Fragment} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Box, Button, Card, Divider, Grid, styled, TextField} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//other libs
import * as yup from 'yup';
import {Formik} from 'formik';
//contexts
import {useAppContext} from '@/contexts/AppContext';
//components
import {FlexBox} from '@/components/common/flex-box';
import {Paragraph} from '@/components/common/typography/Typography';
//types
import {StageInputProps} from '../CartComponentTypes';
import {CartStageEnum} from '../templates';
//functions
import {sessionService} from '@/utils/SessionService';
import {trackCheckout} from '@/components/exponea/ExponeaUtils';

const Card1 = styled(Card)({
  position: 'relative',
  padding: '1.5rem 1.75rem',
  ['@media only screen and (max-width: 678px)']: {padding: '1rem'},
});

export const Billing = (props: BrProps & StageInputProps) => {
  const {stage, setStage} = props;
  const {state} = useAppContext();
  const {t} = useTranslation('cart');

  const handleFormSubmit = async (values: any) => {
    const totalAmount = state.cart.reduce((accum, item) => accum + item.price * item.qty, 0);
    const order = {
      items: state.cart,
      totalAmount: totalAmount,
      taxAmount: (totalAmount * 0.06).toFixed(2),
      shipping: {
        name: values.shipping_name,
        address1: values.shipping_address1,
        zip: values.shipping_zip,
        country: values.shipping_country,
      },

      billing: {
        name: values.billing_name,
        address1: values.billing_address1,
        zip: values.billing_zip,
        country: values.billing_country,
      },
      currency: 'USD',
      shipMethod: 'UPS Ground',
    };
    trackCheckout("billing", order);

    sessionService.saveOrderToSession(order);
    setStage(CartStageEnum.PURCHASE);
  };

  return (
    <Fragment>
      <Card1 sx={{m: 4, mt: 0}}>
        <FlexBox mb={3}>
          <Box>
            <Paragraph>{t('payment-information')}</Paragraph>
          </Box>
        </FlexBox>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({values, errors, touched, handleChange, handleBlur, handleSubmit}) => (
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Grid container spacing={3}>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      fullWidth
                      name='card_no'
                      label={t('card-number')}
                      onBlur={handleBlur}
                      value={values.card_no}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item sm={3} md={2} xs={12}>
                    <TextField
                      fullWidth
                      name='exp_date'
                      label={t('exp-date')}
                      placeholder='MM/YY'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.exp_date}
                    />
                  </Grid>
                  <Grid item sm={2} xs={3}>
                    <TextField
                      fullWidth
                      name='cvc'
                      label={t('cvc')}
                      onBlur={handleBlur}
                      value={values.cvc}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <TextField
                      fullWidth
                      name='billing_name'
                      onBlur={handleBlur}
                      value={values.billing_name}
                      label={t('name-on-card')}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item sm={8} xs={12}>
                    <TextField
                      fullWidth
                      name='billing_address1'
                      label={t('address')}
                      placeholder=''
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.billing_address1}
                    />
                  </Grid>
                  <Grid item sm={3} md={2} xs={12}>
                    <TextField
                      fullWidth
                      name='billing_zip'
                      label={t('zip')}
                      placeholder='94040'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.billing_zip}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name='billing_country'
                      label={t('country')}
                      placeholder='United States'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.billing_country}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{my: 3}} />
                <FlexBox mb={3}>
                  <Box>
                    <Paragraph>{t('shipping-information')}</Paragraph>
                  </Box>
                </FlexBox>
                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name='shipping_name'
                      onBlur={handleBlur}
                      value={values.shipping_name}
                      label={t('name')}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item sm={12} xs={12}>
                    <TextField
                      fullWidth
                      name='shipping_address1'
                      label={t('address')}
                      placeholder=''
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.shipping_address1}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name='shipping_zip'
                      label={t('zip')}
                      placeholder='94040'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.shipping_zip}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name='shipping_country'
                      label={t('country')}
                      placeholder='United States'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.shipping_country}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}></Grid>
                  <Grid item sm={6} xs={12}>
                    <Button variant='contained' color='primary' fullWidth type='submit'>
                      {t('review-order')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </form>
          )}
        </Formik>
      </Card1>
    </Fragment>
  );
};

const initialValues = {
  card_no: '4242424242424242',
  name: 'Bloomreach',
  exp_date: '4/24',
  cvc: '424',
  billing_name: 'Bloomreach',
  billing_zip: '94040',
  billing_country: 'United States',
  billing_address1: '700 E El Camino Real #130, Mountain View, CA',

  shipping_name: 'Bloomreach',
  shipping_zip: '94040',
  shipping_country: 'United States',
  shipping_address1: '700 E El Camino Real #130, Mountain View, CA',
};

const checkoutSchema = yup.object().shape({
  card_no: yup.string().required('required'),
  name: yup.string().required('required'),
  exp_date: yup.string().required('required'),
  cvc: yup.string().required('required'),
  // shipping_zip: yup.string().required("required"),
  // shipping_country: yup.object().required("required"),
  // shipping_address1: yup.string().required("required"),
  // billing_name: yup.string().required("required"),
  // billing_email: yup.string().required("required"),
  // billing_contact: yup.string().required("required"),
  // billing_zip: yup.string().required("required"),
  // billing_country: yup.string().required("required"),
  // billing_address1: yup.string().required("required"),
});
