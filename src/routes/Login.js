import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import CustomTextField from '../components/CustomTextField';
import CustomAlert from '../components/CustomAlert';
import * as Yup from 'yup';
import Snackbar from '@material-ui/core/Snackbar';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';

const LOGIN_USER = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter an email.'),
  password: Yup.string().required('Please enter a password.')
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        pepper
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const [loginUser] = useMutation(LOGIN_USER);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              setTimeout(async () => {
                const response = await loginUser({
                  variables: {
                    email: values.email,
                    password: values.password
                  }
                });
                console.log(response);
                const { ok, errors, token, refreshToken } = response.data.login;
                if (ok) {
                  setOpen(false);
                  setSubmitting(false);
                  localStorage.setItem('token', token);
                  localStorage.setItem('refreshToken', refreshToken);
                  history.push('/');
                } else {
                  console.log(errors);
                  setFieldError('general', errors[0].message);
                  setOpen(true);
                  setSubmitting(false);
                  setTimeout(() => {
                    setOpen(false);
                  }, 5000);
                }
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
                      id="email"
                      name="email"
                      type="email"
                      label="Email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      name="password"
                      id="password"
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
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
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
                  open={open && !!errors.general}
                  onClose={() => {
                    setOpen(false);
                  }}
                >
                  <CustomAlert
                    onClose={() => {
                      setOpen(false);
                    }}
                    severity="error"
                  >
                    {errors.general}
                  </CustomAlert>
                </Snackbar>
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Grid>
    </Grid>
  );
}
