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
import {useEffect, useRef, useState} from 'react';
//mui
import {Button, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//next
import Link from 'next/link';
//components
import {BannerH1Link, BannerParagraph} from '@/components/banner/templates/BannerCommonStyles';
import {Paragraph} from '@/components/common/bazaar/Typography';
//types
import {BannerContent, BannerSize} from '@/components/banner/BannerComponentTypes';
import {PacificLink} from '@/utils/CommonTypes';
//functions
import {stripePTags} from '@/utils/HtmlUtils';
import {ResponsiveStyleValue} from '@mui/system';
import {Property} from 'csstype';
import TextAlign = Property.TextAlign;

interface BannerContentBoxProps {
  hideCta?: boolean;
  html?: string;
  justifyContent?: string;
  alignItems?: string;
  size?: BannerSize;
  textAlign?: string;
}

interface BannerLinkButtonProps {
  label: string;
  isFirst: boolean;
}

export const BannerContentBox = (props: BannerContent & BannerContentBoxProps) => {
  const {
    title,
    subtitle,
    titleLink,
    html,
    links,
    hideCta,
    justifyContent = 'flex-start',
    textAlign = 'left',
    size,
  } = props;

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);

  const stackOptions = downMd ? {justifyContent: 'center', alignItems: 'center'} : {
    justifyContent,
    alignItems: justifyContent,
    textAlign: textAlign as TextAlign,
  };

  const [buttonDirection, setButtonDirection] = useState<ResponsiveStyleValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>>('row');

  useEffect(() => {
    if (ref.current.offsetWidth < 250 && buttonDirection !== 'column') {
      setButtonDirection('column');
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const LinkButton = (props: BannerLinkButtonProps) => {
    const {label, isFirst} = props;
    return <Button
      size={size || 'small'}
      variant={isFirst ? 'contained' : 'outlined'}
      color='primary'
    >
      {label}
    </Button>;
  };

  return (
    <Stack direction={'column'} {...stackOptions} ref={ref}>
      {subtitle && <Paragraph dangerouslySetInnerHTML={{
        __html: stripePTags(subtitle),
      }} />}

      <BannerH1Link size={size}>
        {titleLink?.url ? <Link href={titleLink?.url ?? ''}>{title}</Link> : title}
      </BannerH1Link>

      <BannerParagraph dangerouslySetInnerHTML={{__html: stripePTags(html)}} size={size} />

      {!hideCta && links?.length > 0 && (
        <Stack direction={buttonDirection} spacing={1} {...stackOptions}>
          {links
            ?.filter((link) => link?.url && link?.label)
            .map((link: PacificLink, key: number) => {
              const {url, isExternal, label, openInNewWindow} = link;
              const target = openInNewWindow ? '_blank' : '_self';
              return isExternal ? (
                <a href={url ?? ''} target={target} key={key}>
                  <LinkButton label={label} isFirst={true /*key === 0*/} />
                </a>
              ) : (
                <Link href={url ?? ''} target={target} key={key}>
                  <LinkButton label={label} isFirst={true /*key === 0*/} />
                </Link>
              );
            })}
        </Stack>
      )}
    </Stack>
  );
};