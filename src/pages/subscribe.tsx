import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { FiUser, FiKey, FiAlertCircle } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { Header } from '@/components/Header';
import { Container, Main, Center } from '@/styles/utils/layout';
import { Form } from '@/styles/utils/form';
import { subscribeValidator } from '@/validators';
import { userService } from '@/services/userService';
import { useRouter } from 'next/router';
import { setAuthTokens } from '@/utils/authTokens';
import { useState } from 'react';

const formInitialValues = {
  username: '',
  password: '',
};

const Subscribe: NextPage = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const router = useRouter();

  function handleSubmit(data: typeof formInitialValues) {
    if (isSubmitLoading) return;

    setIsSubmitLoading(true);

    userService
      .subscribe(data)
      .then((tokens) => {
        setAuthTokens(tokens);
        router.replace('/branium');
      })
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setIsSubmitLoading(false));
  }

  const formik = useFormik({
    initialValues: formInitialValues,
    onSubmit: handleSubmit,
    validationSchema: subscribeValidator,
    validateOnChange: false,
  });

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

      <Main>
        <Center>
          <Form onSubmit={formik.handleSubmit}>
            <h1 className="form__title">SignUp</h1>

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
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  placeholder="Username"
                  type="text"
                  className="form__input"
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Password"
                  type="password"
                  className="form__input"
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
              {isSubmitLoading ? <AiOutlineLoading3Quarters /> : 'SignUp'}
            </button>

            <Link href="/login">
              <a className="form__link">SignIn</a>
            </Link>
          </Form>
        </Center>
      </Main>
    </Container>
  );
};

export default Subscribe;
