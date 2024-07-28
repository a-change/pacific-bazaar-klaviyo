import {FC} from 'react';
import {CollectionItem} from '@/utils/CommonTypes';
import {Box, styled, useTheme} from '@mui/material';
import {H4, Span} from '@/components/common/bazaar/Typography';
import {FlexRowCenter} from '@/components/common/flex-box';
import Image from 'next/image';

const FashionServiceItem = styled(FlexRowCenter)(({theme}) => ({
  borderRight: `1px solid ${theme.palette.grey[400]}`,
  '& .service-text': {
    '& p': {
      margin: 0,
    },
  },
  ':last-child': {borderRight: 0},
  [theme.breakpoints.down('md')]: {':nth-of-type(even)': {borderRight: 0}},
  [theme.breakpoints.down('sm')]: {
    borderRight: 0,
    justifyContent: 'flex-start',
  },
}));


export const FashionCard: FC<CollectionItem> = (item: CollectionItem) => {
  const {title, text, images} = item.content.fields;
  const imgsrc = images['thumbnail']?.url;

  const theme = useTheme();
  const {textAlign, textColor} = item.params;
  const color = textColor === 'white' ? theme.palette.common.white : textColor === 'black' ? theme.palette.common.black : theme.palette[textColor].main;

  return (
    <FashionServiceItem flexGrow={1} gap={2}>
      <Image src={imgsrc} height={50} width={50} alt='' />
      <Box textAlign={textAlign}>
        <H4 color={color} lineHeight={1.3}>{title}</H4>
        <Span className='service-text' color={color} dangerouslySetInnerHTML={{__html: text}} />
      </Box>
    </FashionServiceItem>
  );

};