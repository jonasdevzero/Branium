import { NextPage } from 'next';
import Head from 'next/head';

import { Header } from '@/components/Header';
import { Container } from '@/styles/utils/layout';

const Login: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Branium - SignIn</title>
        <meta
          name="description"
          content="The next chat generation, signIn for enjoy the most modern chat"
        />
      </Head>

      <Header isLoginHidden />

      <main>
        <h1>SignIn</h1>
      </main>
    </Container>
  );
};

export default Login;
