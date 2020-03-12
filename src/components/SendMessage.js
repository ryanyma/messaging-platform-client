import React from 'react';
import styled from 'styled-components';
import InputWithIcon from './Input';
import { Input } from '@material-ui/core';
import { Formik, withFormik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import CustomTextField from '../components/CustomTextField';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const Wrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
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
    marginTop: theme.spacing(1),
    backgroundColor: '#F7F8FB'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  textField: {
    backgroundColor: '#F7F8FB'
  }
}));

const StyledInput = styled(Input)`
  width: 750px;
`;

export default function SendMessage({ placeholder, onSubmit, channelId }) {
  const classes = useStyles();

  return (
    <Wrapper className={classes.textField}>
      <Formik
        initialValues={{ message: '' }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          console.log(values);
          if (!values.message || !values.message.trim()) {
            setSubmitting(false);
            return;
          }
          console.log(values);
          await onSubmit(values.message);
          resetForm(false);
          // const { ok, errors, team } = response.data.createTeam;
          // if (ok) {
          //   console.log(response);
          //   setOpen(false);
          //   setSubmitting(false);
          //   history.push(`/view-team/${team.id}`);
          // } else {
          //   setFieldError('general', errors[0].message);
          //   setOpen(true);
          //   setSubmitting(false);
          //   setTimeout(() => {
          //     setOpen(false);
          //   }, 5000);
          // }
        }}
      >
        {({ values, errors, isSubmitting }) => (
          <Form className={classes.form}>
            <CustomTextField
              id="message"
              name="message"
              type="input"
              placeholder={`Message #${placeholder}`}
            />
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
