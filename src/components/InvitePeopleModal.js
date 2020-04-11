import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { Formik, Form, useField } from 'formik';
import Grid from '@material-ui/core/Grid';
import CustomTextField from '../components/CustomTextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Snackbar from '@material-ui/core/Snackbar';
import CustomAlert from '../components/CustomAlert';
import normalizeErrors from '../normalizeErrors';

const ADD_TEAM_MEMBER = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    padding: theme.spacing(2, 4, 3),
    outline: 0,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  heroContent: {
    padding: theme.spacing(3, 0, 2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  closeIcon: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));

const AddPeopleSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Please enter an email.'),
});

export default function InvitePeopleModal({ teamId, open, onClose }) {
  const classes = useStyles();
  const [barOpen, setBarOpen] = React.useState(false);
  const [addTeamMember] = useMutation(ADD_TEAM_MEMBER);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <CloseIcon
              className={classes.closeIcon}
              onClick={() => {
                onClose();
              }}
            ></CloseIcon>
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
              <Typography variant="h4" align="left" color="textPrimary" gutterBottom>
                Invite people to the team
              </Typography>
            </Container>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={AddPeopleSchema}
              onSubmit={(values, { props, setSubmitting, setFieldError, setErrors }) => {
                setTimeout(async () => {
                  teamId = parseInt(teamId);
                  const response = await addTeamMember({
                    variables: {
                      teamId,
                      email: values.email,
                    },
                  });
                  setSubmitting(false);

                  const { ok, errors, teamMember } = response.data.addTeamMember;
                  if (ok) {
                    setSubmitting(false);
                    onClose();
                  } else {
                    setErrors(
                      normalizeErrors(
                        errors.map((e) =>
                          e.message === 'user_id must be unique'
                            ? {
                                path: 'email',
                                message: 'this user is already part of the team',
                              }
                            : e
                        )
                      )
                    );
                    setSubmitting(false);
                  }
                }, 400);
              }}
            >
              {({ values, errors, touched, isSubmitting, validateOnChange, validateOnBlur }) => (
                <Form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomTextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        validateOnChange={false}
                        validateOnBlur={false}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className={classes.submit}
                  >
                    Add
                  </Button>
                  <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    open={open && !!errors.general}
                    onClose={() => {
                      setBarOpen(false);
                    }}
                  >
                    <CustomAlert
                      onClose={() => {
                        setBarOpen(false);
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
        </Fade>
      </Modal>
    </div>
  );
}
