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
import {FC, useEffect, useState} from 'react';
//mui
import {Box, Button, Container, Link, Stack, styled} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
//hooks
import useWindowSize from '@/hooks/useWindowSize';
//components
import {FlexStart} from '@/components/common/flex-box';
import {PacificLink} from '@/utils/CommonTypes';
//types
import {BannerTemplateProps} from '../BannerComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
//functions
import {getImageSize} from '@/utils/ImageUtils';
import {Paragraph} from '@/components/common/bazaar/Typography';
import {stripePTags} from '@/utils/HtmlUtils';
import {getJustifyContent} from '@/components/banner/BannerComponentUtils';

//Custom styled components
const BannerSlideBox = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'imageset' && prop !== 'imageUrl' && prop !== 'textColor' && prop !== 'justifyContent',
})<{imageset?: any; imageUrl?: string; textColor?: string; justifyContent?: string}>(
  ({theme, imageset, imageUrl, textColor, justifyContent}) => ({
    'alignItems': 'center',
    'backgroundColor': theme.palette.background.paper,
    'backgroundImage': (imageset && `url('${imageset[ImageSizeEnum.Original]?.url}')`) ?? imageUrl,
    'backgroundPosition': imageset && 'center center',
    'backgroundRepeat': imageset && 'no-repeat',
    'backgroundSize': imageset && 'cover',
    'display': 'flex',
    'justifyContent': `${justifyContent}`,
    'minHeight': 520,
    '.content-box': {
      'backgroundColor':
        textColor === 'white' || textColor === '#fff'
          ? 'rgba(0,0,0,0.65)'
          : 'rgba(255,255,255,0.65)',
      'color': textColor ?? theme.palette.secondary.main,
      'margin': 0,
      'padding': 16,
      '.actions': {
        marginTop: 21.6,
      },
      'h1': {
        color: 'inherit',
        //fontSize: 30, //50
        lineHeight: 1.2,
        marginBottom: '1.35rem',
        marginTop: 0,
      },
      'h2': {
        color: 'inherit',
        //fontSize: 20,
        lineHeight: 1.2,
        marginBottom: 0,
        marginTop: 0,
      },
      'h3': {
        color: 'inherit',
        //fontSize: 35,
        lineHeight: 1.2,
        marginBottom: 0,
        marginTop: 0,
      },
      'h4': {
        color: 'inherit',
        //fontSize: 30,
        fontWeight: 600,
        lineHeight: 1,
        marginBottom: 8,
        marginTop: 0,
      },
      'h5': {
        color: 'inherit',
        //fontSize: 18,
        fontWeight: 700,
        lineHeight: 1.5,
        marginBottom: 8,
        marginTop: 0,
      },
      'h6': {
        color: 'inherit',
        //fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.2,
        marginBottom: 8,
        marginTop: 0,
      },
      'p': {
        color: 'inherit',
      },
    },
    '.title': {
      color: textColor ?? theme.palette.text.primary,
      //fontSize: 50,
      lineHeight: 1.2,
      marginBottom: '1.35rem',
      marginTop: 0,
    },
    '.subtitle': {
      color: textColor ?? theme.palette.text.primary,
      marginBottom: 10,
    },
    '.paragraph': {
      color: textColor ?? theme.palette.secondary.main,
      marginBottom: 21.6,
      p: {
        fontSize: 'inherit',
        margin: 0,
        padding: 0,
      },
    },
    [theme.breakpoints.up('sm')]: {
      '.content-box': {
        justifyContent: 'center',
        margin: 24,
        minHeight: 360,
        padding: 16,
        width: '35%',
      },
    },
    [theme.breakpoints.down('lg')]: {
      // height: '30vw',
    },
    [theme.breakpoints.down('md')]: {
      backgroundImage: imageset && `url('${imageset[ImageSizeEnum.Large]?.url}')`,
      // height: '40vw',
    },
    [theme.breakpoints.down('sm')]: {
      'backgroundImage': imageset && `url('${imageset[ImageSizeEnum.MediumSquare]?.url}')`,
      'alignItems': 'start',
      '.content-box': {
        justifyContent: 'start',
        width: '100%',
        h1: {
          fontSize: 32,
        },
      },
      '.title': {
        fontSize: 32,
      },
    },
    [theme.breakpoints.down('xs')]: {
      '.content-box': {
        h1: {
          fontSize: 16,
        },
      },
      '.title': {fontSize: 16},
      '.title + *': {fontSize: 13},
      '.button-link': {fontSize: 13, height: 36, padding: '0 1.5rem'},
    },
  }),
);

export const BannerSlide: FC<BannerTemplateProps> = (props: BannerTemplateProps) => {
  const {bannerContent, bannerParams} = props;

  const width = useWindowSize();
  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const [imageUrl, setImageUrl] = useState('/assets/imgs/banners/banner-placeholder.jpg');

  const {title, subtitle, text, links, images} = bannerContent;
  const [html, setHtml] = useState('');

  useEffect(() => {
    setImageUrl(images[getImageSize(width, images)]?.url);
  }, [width, images]);

  useEffect(() => {
    setHtml(text);
  }, [text]);

  const {textColor, textAlignment, imageAlignment} = bannerParams;
  const justifyContent = getJustifyContent(textAlignment, downMd);

  return (
    <BannerSlideBox
      imageset={images}
      imageUrl={imageUrl}
      textColor={textColor}
      justifyContent={justifyContent}
    >
      <Container
        disableGutters
        sx={{
          display: 'flex',
          justifyContent,
        }}
      >
        <Stack className='content-box'>
          {subtitle && <Paragraph className='subtitle' dangerouslySetInnerHTML={{
            __html: stripePTags(subtitle),
          }} />}
          {title && <h1 className='title'>{title}</h1>}
          {html && <Box dangerouslySetInnerHTML={{__html: html}} />}

          <FlexStart className='actions' sx={{flexFlow: 'row wrap', gap: 1}}>
            {links?.map((link: PacificLink, key: number) =>
              link.url && link.isExternal ? (
                <a href={link.url ?? '#'} key={key}>
                  <Button
                    size={link.size ?? 'large'}
                    // TODO: Compile error
                    // color={link.color ?? 'primary'}
                    color={'primary'}
                    disableElevation={link.disableElevation ?? true}
                    variant={link.variant ?? 'contained'}
                    className='button-link'
                  >
                    {link.label}
                  </Button>
                </a>
              ) : (
                // The below <Link> default href may need to be changed
                <Link href={link.url ?? ''} key={key}>
                  <Button
                    size={link.size ?? 'large'}
                    // TODO: Compile error
                    // color={link.color ?? 'primary'}
                    color={'primary'}
                    disableElevation={link.disableElevation ?? true}
                    variant={link.variant ?? 'contained'}
                    className='button-link'
                  >
                    {link.label}
                  </Button>
                </Link>
              ),
            )}
          </FlexStart>
        </Stack>
      </Container>
    </BannerSlideBox>
  );
};
