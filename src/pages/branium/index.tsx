import { NextPage } from 'next';
import Head from 'next/head';

import { Sidebar } from '@/components/Sidebar';

import { Container } from '@/styles/pages/branium';

const Branium: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Branium</title>
      </Head>

      <Sidebar />
    </Container>
  );
};

export default Branium;
