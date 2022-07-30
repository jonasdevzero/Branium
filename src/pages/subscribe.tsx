import { NextPage } from 'next';
import Head from 'next/head';

import { Header } from '@/components/Header';
import { Container } from '@/styles/pages/subscribe';

const Subscribe: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Branium - SignUp</title>
        <meta
          name="description"
          content="The next chat generation, signUp for start right now to use one of the most modern chat"
        />
      </Head>

      <Header />
    </Container>
  );
};

export default Subscribe;
