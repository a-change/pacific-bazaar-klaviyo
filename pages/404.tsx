import Link from 'next/link';
import {NextPage} from 'next';
import {Button} from '@mui/material';
import {useRouter} from 'next/router';
import BazaarImage from '@/components/common/bazaar/BazaarImage';
import {FlexBox, FlexRowCenter} from '@/components/common/flex-box';
import Head from 'next/head';

const Error404: NextPage = () => {
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <FlexRowCenter px={2} minHeight='100vh' flexDirection='column'>
      <Head>
        <title>{'Page Not Found'}</title>
      </Head>
      <BazaarImage
        src='/assets/imgs/common/404.svg'
        sx={{display: 'block', maxWidth: 320, width: '100%', mb: 3}}
      />

      <FlexBox flexWrap='wrap'>
        <Button
          variant='outlined'
          color='primary'
          sx={{m: 1}}
          onClick={handleGoBack}
        >
          Go Back
        </Button>

        <Link href='/' passHref legacyBehavior>
          <Button variant='contained' color='primary' sx={{m: 1}}>
            Go to Home
          </Button>
        </Link>
      </FlexBox>
    </FlexRowCenter>
  );
};

export default Error404;
