import { FlexRowCenter } from './components/flex-box';
import appIcons from './components/icons';
import { Card, CardContent, CardMedia, Container, Typography, styled, useTheme } from '@mui/material';
import { NextPage } from 'next';

const IconCard = styled(Card)({
  width: 200
});

const icons = Object.keys(appIcons).map((k) => {
  return k;
}).sort();

const IconsPage: NextPage = () => {
  const theme = useTheme();
  return (
    <Container maxWidth={'xl'}>
      <FlexRowCenter flexWrap='wrap' gap={3} mt={3}>
        {icons.map((i, key) => {
          const Icon = appIcons[i];
          return (
            <IconCard key={key} variant='outlined'>
              <CardMedia sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 2
              }}>
                <Icon sx={{ color: theme.palette.text.primary, fontSize: 80 }} />
              </CardMedia>
              <CardContent sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Typography variant='subtitle1'>{i}</Typography>
              </CardContent>
            </IconCard>
          );
        })
        }
      </FlexRowCenter>
    </Container>
  );

}

export default IconsPage;