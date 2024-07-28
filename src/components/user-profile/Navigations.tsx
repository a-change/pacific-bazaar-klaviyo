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
import {FC, Fragment, useEffect, useState} from 'react';
//next
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
//mui
import {Card, styled, Typography} from '@mui/material';
import {CreditCard, FavoriteBorder, Person, Place} from '@mui/icons-material';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
//components
import {FlexBox} from '@/components/common/flex-box';
import NavLink, {NavLinkProps} from '@/components/common/nav-link/NavLink';
//functions
import CustomerService from '@/components/common/icons/CustomerService';
import {sessionService} from '@/utils/SessionService';

// custom styled components
const MainContainer = styled(Card)(({theme}) => ({
  paddingBottom: '1.5rem',
  [theme.breakpoints.down('md')]: {
    boxShadow: 'none',
    overflowY: 'auto',
    height: 'calc(100vh - 64px)',
  },
}));

type StyledNavLinkProps = {isCurrentPath: boolean};

const StyledNavLink = styled<FC<StyledNavLinkProps & NavLinkProps>>(
  ({children, isCurrentPath, ...rest}) => <NavLink {...rest}>{children}</NavLink>,
)<StyledNavLinkProps>(({theme, isCurrentPath}) => ({
  'display': 'flex',
  'alignItems': 'center',
  'borderLeft': '4px solid',
  'paddingLeft': '1.5rem',
  'paddingRight': '1.5rem',
  'marginBottom': '1.25rem',
  'justifyContent': 'space-between',
  'borderColor': isCurrentPath ? theme.palette.primary.main : 'transparent',
  '& .nav-icon': {
    color: isCurrentPath ? theme.palette.primary.main : theme.palette.grey[600],
  },
  '&:hover': {
    'borderColor': theme.palette.primary.main,
    '& .nav-icon': {color: theme.palette.primary.main},
  },
}));

const Navigations = ({page}) => {
  const {pathname} = useRouter();
  const {t} = useTranslation('profile');

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const orders = sessionService.readCompletedOrdersFromSession() ?? [];
    setOrders(orders);
  }, []);

  const profileLink = page.getUrl('/profile');

  const linkList = [
    {
      title: 'dashboard',
      list: [
        {
          href: `${page.getUrl('/profile?active=my-orders')}`,
          title: 'Orders',
          icon: ShoppingBagOutlined,
          count: orders.length,
        },
        {
          href: profileLink,
          title: 'wishlist',
          icon: FavoriteBorder,
          count: 19,
        },
        {
          href: profileLink,
          title: 'support-tickets',
          icon: CustomerService,
          count: 1,
        },
      ],
    },
    {
      title: 'account-settings',
      list: [
        {href: profileLink, title: 'profile-info', icon: Person, count: 3},
        {href: profileLink, title: 'addresses', icon: Place, count: 16},
        {
          href: profileLink,
          title: 'payment-methods',
          icon: CreditCard,
          count: 4,
        },
      ],
    },
  ];

  return (
    <MainContainer>
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p='26px 30px 1rem' color='grey.600' fontSize='12px'>
            {t(item.title)}
          </Typography>

          {item.list.map((item) => (
            <StyledNavLink
              href={item.href ?? ''}
              key={item.title}
              isCurrentPath={pathname.includes(item.href)}
            >
              <FlexBox alignItems='center' gap={1}>
                <item.icon color='inherit' fontSize='small' className='nav-icon' />
                <span>{t(item.title)}</span>
              </FlexBox>

              <span>{item.count}</span>
            </StyledNavLink>
          ))}
        </Fragment>
      ))}
    </MainContainer>
  );
};

export default Navigations;
