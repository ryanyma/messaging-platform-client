import React from 'react';
import { Formik, Form } from 'formik';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { Button } from '@material-ui/core';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import { useHistory } from 'react-router-dom';
import CustomTextField from '../components/CustomTextField';
import CustomAlert from '../components/CustomAlert';

import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const REGISTER_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const CopyRight = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="/">
      pepper
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
);

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.warning.light
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Please enter a username.'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter an email.'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Please enter a password.')
});

const Register = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const [registerUser] = useMutation(REGISTER_USER);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            console.log(values);
            setTimeout(async () => {
              const response = await registerUser({
                variables: {
                  username: values.username,
                  email: values.email,
                  password: values.password
                }
              });
              const { ok, errors } = response.data.register;
              console.log(errors)
              if (ok) {
                setOpen(false);
                setSubmitting(false);
                history.push('/');
              } else {
                setFieldError('general', errors[0].message);
                setOpen(true);
                setSubmitting(false);
                setTimeout(() => {
                  setOpen(false);
                }, 5000);
              }
              console.log(response);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            isSubmitting,
          }) => (
            <Form className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomTextField
                    id="username"
                    name="username"
                    label="Username"
                    type="input"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                  />
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>

                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Grid>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                autoHideDuration={6000}
                open={open}
                onClose={handleClose}
              >
                <CustomAlert onClose={handleClose} severity="error">
                  {errors.general}
                </CustomAlert>
              </Snackbar>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}>
        <CopyRight />
      </Box>
    </Container>
  );
};

export default Register;
