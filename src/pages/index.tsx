import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { Header } from '@/components/Header';
import { Container, ImageContainer, Inner, Main } from '@/styles/pages/landing';

const Home: NextPage = () => (
  <Container>
    <Head>
      <title>Branium</title>
      <meta name="description" content="The next chat generation" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />

    <Main>
      <Inner>
        <h2 className="main__title">
          The Next Chat <br /> Generation
        </h2>

        <Link href="/subscribe">
          <a className="main__subscribe">Subscribe</a>
        </Link>
      </Inner>

      <ImageContainer>
        <Image
          src="/assets/img/social-media-users.svg"
          layout="fill"
          alt="Users in a social media"
          priority
        />
      </ImageContainer>
    </Main>
  </Container>
);

export default Home;
