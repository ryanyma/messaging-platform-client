import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { Formik, Form, useField } from 'formik';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import Downshift from 'downshift';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { GET_TEAM_MEMBERS } from '../graphql/teams';
import { GET_ME } from '../graphql/teams';
import findIndex from 'lodash/findIndex';
import MultiSelectUsers from './MultiSelectUsers';

const GET_OR_CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $members: [Int!]!) {
    getOrCreateChannel(teamId: $teamId, members: $members) {
      id
      name
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
    margin: theme.spacing(3, 1, 2),
  },
  closeIcon: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));

export default function DirectMessageModal({ teamId, open, onClose, currentUserId }) {
  const classes = useStyles();
  const history = useHistory();
  const [barOpen, setBarOpen] = React.useState(false);
  const [getOrCreateChannel] = useMutation(GET_OR_CREATE_CHANNEL, {
    update: (cache, { data: { getOrCreateChannel } }) => {
      const { id, name } = getOrCreateChannel;

      const data = cache.readQuery({ query: GET_ME });
      const teamIndex = findIndex(data.me.teams, ['id', teamId]);

      const notInChannelList = data.me.teams[teamIndex].channels.every((c) => c.id !== id);
      if (notInChannelList) {
        data.me.teams[teamIndex].channels.push({ __typename: 'Channel', id, name, dm: true });
        cache.writeQuery({
          query: GET_ME,
          data: data,
        });
      }
      history.push(`/view-team/${teamId}/${id}`);
    },
  });

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
              initialValues={{ members: [] }}
              onSubmit={(values, { props, setSubmitting, setFieldError, setErrors, resetForm }) => {
                setTimeout(async () => {
                  const membersIdArr = values.members.map((m) => m.id);
                  teamId = parseInt(teamId);
                  const response = await getOrCreateChannel({
                    variables: {
                      teamId,
                      members: membersIdArr,
                    },
                  });
                  setSubmitting(false);
                  resetForm();
                  onClose();
                }, 400);
              }}
            >
              {({
                values,
                errors,
                touched,
                setFieldValue,
                isSubmitting,
                validateOnChange,
                validateOnBlur,
              }) => (
                <Form className={classes.form}>
                  <MultiSelectUsers
                    value={values.members}
                    handleChange={(e, value) => setFieldValue('members', value)}
                    teamId={teamId}
                    placeholder="Select members to message"
                    currentUserId={currentUserId}
                  ></MultiSelectUsers>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className={classes.submit}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className={classes.submit}
                  >
                    Start Messaging
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
