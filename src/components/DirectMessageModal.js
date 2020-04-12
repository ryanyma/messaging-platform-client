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
import { useQuery } from '@apollo/react-hooks';
import Snackbar from '@material-ui/core/Snackbar';
import CustomAlert from '../components/CustomAlert';
import normalizeErrors from '../normalizeErrors';
import Downshift from 'downshift';
import { useHistory } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { GET_TEAM_MEMBERS } from '../graphql/teams';

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

function Autocomplete({ items, onChange }) {
  console.log(items);
  return (
    <Downshift onChange={onChange}>
      {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
        <div>
          <TextField {...getInputProps({ items: items })} />
          {isOpen ? (
            <div style={{ border: '1px solid #ccc' }}>
              {items
                .filter(
                  (i) => !inputValue || i.username.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((item, index) => (
                  <div
                    {...getItemProps({ item })}
                    key={item.id}
                    style={{
                      backgroundColor: highlightedIndex === index ? 'gray' : 'white',
                      fontWeight: selectedItem === item ? 'bold' : 'normal',
                    }}
                  >
                    {item.username}
                  </div>
                ))}
            </div>
          ) : null}
        </div>
      )}
    </Downshift>
  );
}

export default function DirectMessageModal({ teamId, open, onClose }) {
  const classes = useStyles();
  const history = useHistory();
  const [barOpen, setBarOpen] = React.useState(false);
  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS, {
    variables: {
      teamId: teamId,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  //   const members = data.getTeamMembers;
  const members = data.getTeamMembers;

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
              initialValues={{}}
              onSubmit={(values, { props, setSubmitting, setFieldError, setErrors }) => {
                onClose();
              }}
            >
              {({ values, errors, touched, isSubmitting, validateOnChange, validateOnBlur }) => (
                <Form className={classes.form}>
                  <Autocomplete
                    items={data.getTeamMembers}
                    onChange={(selectedUser) => {
                      history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                      onClose();
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className={classes.submit}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
