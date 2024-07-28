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
import {ArrowForward} from '@mui/icons-material';
import {Span} from '@/components/common/bazaar/Typography';
import Link from 'next/link';
import {FC} from 'react';

//   ==========================================
type NavLink3Props = {
  href: string;
  text: string;
  color?: string;
  hoverColor?: string;
};
//   ==========================================

const NavLink3: FC<NavLink3Props> = ({
                                       color,
                                       href,
                                       text,
                                       hoverColor,
                                       ...props
                                     }) => {
  return (
    <Link href={href ?? ''} legacyBehavior>
      <a>
        <Span
          sx={{
            color,
            'gap': 1,
            'lineHeight': 1,
            'fontWeight': 600,
            'alignItems': 'center',
            'position': 'relative',
            'paddingBottom': '4px',
            'display': 'inline-flex',
            ':after': {
              left: 0,
              bottom: 0,
              width: '0%',
              content: '\'\'',
              height: '2px',
              transition: '0.3s',
              position: 'absolute',
              backgroundColor: color,
            },
            ':hover': {
              'color': hoverColor,
              '&::after': {width: '100%', backgroundColor: hoverColor},
            },
          }}
          {...props}
        >
          {text}{' '}
          <ArrowForward
            sx={{
              fontSize: 14,
              flexShrink: 0,
              transform: ({direction}) => `rotate(${direction === 'rtl' ? '180deg' : '0deg'})`,
            }}
          />
        </Span>
      </a>
    </Link>
  );
};

// set default props
NavLink3.defaultProps = {color: 'text.primary', hoverColor: 'primary.main'};

export default NavLink3;
