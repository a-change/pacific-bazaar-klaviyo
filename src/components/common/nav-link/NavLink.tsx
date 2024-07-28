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
import {styled} from '@mui/material';
import clsx from 'clsx';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {AnchorHTMLAttributes, CSSProperties, FC} from 'react';

// component props interface
export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  style?: CSSProperties;
  className?: string;
}

// styled component
const StyledLink = styled('a')<{active_route?: string}>(
  ({theme, active_route}) => ({
    position: 'relative',
    transition: 'color 150ms ease-in-out',
    color: active_route === 'active' ? theme.palette.primary.main : 'inherit',
    '&:hover': {color: `${theme.palette.primary.main} !important`},
  }),
);

const NavLink: FC<NavLinkProps> = ({
                                     href,
                                     children,
                                     style,
                                     className,
                                     ...props
                                   }) => {
  const {pathname} = useRouter();

  const checkRouteMatch = () => {
    if (href === '/') return pathname === href;
    return pathname.includes(href);
  };
  // active route
  const currentRoute = checkRouteMatch();
  // @ts-ignore
  return (
    <Link href={href ?? ''} passHref legacyBehavior>
      <StyledLink
        href={href ?? ''}
        style={style}
        className={clsx(className)}
        active_route={currentRoute ? 'active' : ''}
        {...props}
      >
        {children}
      </StyledLink>
    </Link>
  );
};

export default NavLink;
