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
import {FC, useCallback, useContext, useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
//mui
import {Box, Button, Card, CardProps, CircularProgress, styled} from '@mui/material';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//other libs
import * as yup from 'yup';
import {useFormik} from 'formik';
//contexts
import {UserContext} from '@/contexts/UserContext';
//hocs
import {LoginProps, withLogin} from '@/hocs/user/LoginHoc';
//components
import {H1, H6} from '@/components/common/bazaar/Typography';
import BazaarTextField from '@/components/common/bazaar/BazaarTextField';
import {FlexBox, FlexRowCenter} from '@/components/common/flex-box';
//templates
import EyeToggleButton from './EyeToggleButton';

type WrapperProps = {passwordVisibility?: boolean};

export const Wrapper = styled<FC<WrapperProps & CardProps>>(
  ({children, passwordVisibility, ...rest}) => <Card {...rest}>{children}</Card>,
)<CardProps>(({theme, passwordVisibility}) => ({
  'width': 500,
  'padding': '2rem 3rem',
  [theme.breakpoints.down('sm')]: {width: '100%'},
  '.passwordEye': {
    color: passwordVisibility ? theme.palette.grey[600] : theme.palette.grey[400],
  },

  '.agreement': {marginTop: 12, marginBottom: 24},
}));


const LoginBase = (props: BrProps & LoginProps) => {
  const {page, login, customer, cart, loading} = props;
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const {
    userState: {setUser},
    segmentationState: {segmentationStatus, setSegmentationStatus, setSegmentUpdates},
  } = useContext(UserContext)!;
  const {t} = useTranslation('profile');

  useEffect(() => {
    if (!loading) {
      if (customer) {
        setUser(customer);
        //router.reload();
        window.location.href = page.getUrl('/');
      }
    }
  }, [loading, customer]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const handleFormSubmit = async (values: any) => {
    const {email, password} = values;

    if (email && password) {
      await login(email);
    }
  };

  const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema,
  });

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <H1 textAlign='center' mt={1} mb={4} fontSize={16}>
          {t('welcome-to-home')}
        </H1>
        <BazaarTextField
          mb={1.5}
          fullWidth
          name='email'
          size='small'
          type='email'
          variant='outlined'
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          label={t('email-or-phone-number')}
          placeholder='exmple@mail.com'
          error={!!touched.email && !!errors.email}
          helperText={(touched.email && errors.email) as string}
        />
        <BazaarTextField
          mb={2}
          fullWidth
          size='small'
          name='password'
          label={t('password')}
          autoComplete='on'
          variant='outlined'
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          placeholder='*********'
          type={passwordVisibility ? 'text' : 'password'}
          error={!!touched.password && !!errors.password}
          helperText={(touched.password && errors.password) as string}
          InputProps={{
            endAdornment: (
              <EyeToggleButton show={passwordVisibility} click={togglePasswordVisibility} />
            ),
          }}
        />
        <Button fullWidth type='submit' color='primary' variant='contained' sx={{height: 44}}>
          {loading && <CircularProgress color='inherit' size={10} />}{t('login')}
        </Button>
      </form>

      <FlexRowCenter mt='1.25rem'>
        <Box>{t('no-account')}</Box>
        {/* TODO: Maybe enable sign up? or remove entirely. Divs were originally <a>*/}
        {/* <Link href='#' passHref legacyBehavior> */}
        <div style={{cursor: 'pointer'}}>
          <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
            {t('sign-up')}
          </H6>
        </div>
        {/* </Link> */}
      </FlexRowCenter>

      <FlexBox justifyContent='center' bgcolor='grey.200' borderRadius='4px' py={2.5} mt='1.25rem'>
        {t('forgot-password')}
        {/* TODO: Determine how to handle this. Divs were originally <a> */}
        {/* <Link href='#' passHref legacyBehavior> */}
        <div style={{cursor: 'pointer'}}>
          <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
            {t('reset')}
          </H6>
        </div>
        {/* </Link> */}
      </FlexBox>

      {segmentationStatus > 1 && <FlexRowCenter mt='1.25rem' sx={{
        color: 'error.main',
      }}>
        <Box>{t('segmentation-updated-reload')}</Box>
        <div style={{cursor: 'pointer'}}>
          <H6 ml={1} borderBottom='1px solid' borderColor='grey.900' onClick={() => {
            setSegmentationStatus(0);
            setSegmentUpdates([]);
            setTimeout(() => {
              window.location.href = page.getUrl('/');
            }, 500);
          }}>
            {t('reload')}
          </H6>
        </div>
      </FlexRowCenter>}
    </Wrapper>
  );
};

const initialValues = {
  email: '',
  password: '',
};

const formSchema = yup.object().shape({
  password: yup.string().required('Password is required'),
  email: yup.string().email('invalid email').required('Email is required'),
});

const Login = withLogin(LoginBase);
export default Login;
