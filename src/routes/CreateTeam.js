import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
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

const CREATE_TEAM = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

const CreateTeamSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(25, 'Too Long!')
        .required('Please enter a team name.'),
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

export default function CreateTeam() {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const [createTeam] = useMutation(CREATE_TEAM);
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
            Create A Team
          </Typography>
          <Formik
            initialValues={{ name:'' }}
            validationSchema={CreateTeamSchema}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              setTimeout(async () => {
                const response = await createTeam({
                  variables: {
                    name: values.name
                  }
                });
                const { ok, errors, team} = response.data.createTeam;
                console.log(team);
                if (ok) {
                  console.log(response)
                  setOpen(false);
                  setSubmitting(false);
                  history.push(`/view-team/${team.id}`);
                } else {
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
                      id="name"
                      name="name"
                      type="input"
                      label="Name"
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
                    Create
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
      </Grid>
    </Grid>
  );
}
