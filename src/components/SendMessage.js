import React from 'react';
import styled from 'styled-components';
import InputWithIcon from './Input';
import { Input } from '@material-ui/core';
import { Formik, withFormik, Form } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import CustomTextField from '../components/CustomTextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import FileUpload from './FileUpload';
import AttachButton from '../utils/AttachButton';

const Wrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
  display: grid;
  grid-template-columns: 50px auto;

  border-radius: 5px;

  display: flex;
  align-items: center;
  background-color: #ffc0cb;
`;

const StyledDivider = styled.div`
  margin: 0 0;
  width: 1px;
  height: 34px;
  background-color: hsla(0, 0%, 100%, 0.1);
`;

const StyledTextarea = styled.input`
  margin: 2px 2px 2px 0;
  background: 0;
  border: 0;
  outline: 0;
  color: hsla(0, 0%, 100%, 0.7);
  font-size: 0.9375rem;
  letter-spacing: -0.025rem;
  line-height: 1.25rem;
  max-height: 144px;
  min-height: 20px;
  padding: 10px;
  resize: none;
  width: 100%;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    margin: '2px 2px 2px 0',
    background: 0,
    border: 0,
    outline: 0,
    color: '#ffc0cb',
    fontSize: '0.9375rem',
    letterSpacing: '-0.025rem',
    lineHeight: '1.25rem',
    maxHeight: '144px',
    minHeight: '20px',
    padding: '10px',
    resize: 'none',
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    backgroundColor: '#484C52',
  },
  button: {
    padding: 0,
    marginTop: theme.spacing(3),
  },
}));

const StyledInput = styled(Input)`
  width: 750px;
`;

export default function SendMessage({ placeholder, onSubmit, channelId }) {
  const classes = useStyles();

  return (
    <Wrapper className={classes.textField}>
      <FileUpload channelId={channelId}>
        <AttachButton></AttachButton>
      </FileUpload>
      <StyledDivider></StyledDivider>
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
        {({ values, errors, handleChange, handleBlur, isSubmitting }) => (
          <Form className={classes.form}>
            <StyledTextarea
              id="message"
              name="message"
              type="input"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`Message #${placeholder}`}
            />
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
