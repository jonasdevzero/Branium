import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { FiUser, FiKey, FiAlertCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { Header } from '@/components/Header';
import { Container, Main, Center } from '@/styles/utils/layout';
import { Form } from '@/styles/utils/form';
import { useFormik } from 'formik';
import { loginValidator } from '@/validators';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { hasAuthTokens } from '@/utils/authTokens';

const formInitialValues = {
  username: '',
  password: '',
};

const Login: NextPage = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const auth = useAuth();
  const router = useRouter();

  async function handleSubmit(data: typeof formInitialValues) {
    if (isSubmitLoading) return;

    setIsSubmitLoading(true);

    auth
      .signIn(data)
      .then(() => router.replace('/branium'))
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setIsSubmitLoading(false));
  }

  const formik = useFormik({
    initialValues: formInitialValues,
    onSubmit: handleSubmit,
    validationSchema: loginValidator,
    validateOnChange: false,
  });

  useEffect(() => {
    hasAuthTokens() ? router.replace('/branium') : null;
  }, [router]);

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

      <Main>
        <Center>
          <Form onSubmit={formik.handleSubmit}>
            <h1 className="form__title">SignIn</h1>

            <label className="form__label" htmlFor="username">
              {formik.errors.username && (
                <strong className="form__error">
                  <FiAlertCircle />
                  {formik.errors.username}
                </strong>
              )}

              <div
                className={`label__inner ${formik.errors.username && 'error'}`}
              >
                <span className="form__icon">
                  <FiUser />
                </span>

                <input
                  id="username"
                  name="username"
                  placeholder="Username"
                  type="text"
                  className="form__input"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
              </div>
            </label>

            <label className="form__label" htmlFor="password">
              {formik.errors.password && (
                <strong className="form__error">
                  <FiAlertCircle />
                  {formik.errors.password}
                </strong>
              )}

              <div
                className={`label__inner ${formik.errors.password && 'error'}`}
              >
                <span className="form__icon">
                  <FiKey />
                </span>

                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="form__input"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
            </label>

            <button
              type="submit"
              className={`
                form__submit
                ${isSubmitLoading && 'submit__loading'}
              `}
            >
              {isSubmitLoading ? <AiOutlineLoading3Quarters /> : 'SignIn'}
            </button>

            <Link href="/subscribe">
              <a className="form__link">SignUp</a>
            </Link>
          </Form>
        </Center>
      </Main>
    </Container>
  );
};

export default Login;
