import {FC, ReactNode, useEffect, useState} from 'react';
import {Badge, Box} from '@mui/material';
import Home from '../icons/Home';
import User2 from '../icons/User2';
import CategoryOutlined from '../icons/CategoryOutline';
import ShoppingBagOutlined from '../icons/ShoppingBagOutlined';
import useWindowSize from '@/hooks/useWindowSize';
import {layoutConstant} from '../../utils/constants';
import {useAppContext} from '@/contexts/AppContext';
import {iconStyle, StyledBox, StyledDrawer, StyledNavLink, Wrapper} from './styles';

// ===================================================
type Props = {children?: ReactNode};
// ===================================================

/**
 * Difference between MobileNaviagationBar and MobileNaviagationBar2
 * 1. In the MobileNaviagationBar we doesn't use conditinally render
 * 2. In the list array if doesn't exists href property then open category menus sidebar drawer in MobileNaviagationBar2
 */

const MobileNavigationBar2: FC<Props> = ({children}) => {
  const width = useWindowSize();
  const {state} = useAppContext();
  const [open, setOpen] = useState(false);

  const {mobileNavHeight, topbarHeight} = layoutConstant;
  const total = mobileNavHeight + topbarHeight;
  const [totalHeight, setTotalHeight] = useState<number>(total);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  useEffect(() => {
    const listner = () => {
      if (window.scrollY > 30) setTotalHeight(mobileNavHeight);
      else setTotalHeight(total);
    };

    window.addEventListener('scroll', listner);
    return () => window.removeEventListener('scroll', listner);
  }, [mobileNavHeight, total]);

  return width <= 900 ? (
    <Box position='relative' display='flex' flexDirection='column'>
      <StyledDrawer open={open} anchor='left' totalheight={totalHeight} onClose={handleDrawerClose}>
        {children}
      </StyledDrawer>

      <Wrapper>
        {list.map((item) => {
          if (item.href) {
            return (
              <StyledNavLink href={item.href} key={item.title}>
                {item.title === 'Cart' && (
                  <Badge
                    badgeContent={state.cart.reduce((qty, item) => (qty += item.qty), 0)}
                    color='primary'
                  >
                    <item.icon fontSize='small' sx={iconStyle} />
                  </Badge>
                )}

                {item.title !== 'Cart' && <item.icon sx={iconStyle} fontSize='small' />}
                {item.title}
              </StyledNavLink>
            );
          } else {
            return (
              <StyledBox onClick={open ? handleDrawerClose : handleDrawerOpen} key={item.title}>
                {item.title === 'Cart' && (
                  <Badge
                    badgeContent={state.cart.reduce((qty, item) => (qty += item.qty), 0)}
                    color='primary'
                  >
                    <item.icon fontSize='small' sx={iconStyle} />
                  </Badge>
                )}

                {item.title !== 'Cart' && <item.icon sx={iconStyle} fontSize='small' />}
                {item.title}
              </StyledBox>
            );
          }
        })}
      </Wrapper>
    </Box>
  ) : null;
};

const list = [
  {title: 'Home', icon: Home, href: '/'},
  {title: 'Category', icon: CategoryOutlined},
  {title: 'Cart', icon: ShoppingBagOutlined, href: '/cart'},
  {title: 'Account', icon: User2, href: '/profile'},
];

export default MobileNavigationBar2;