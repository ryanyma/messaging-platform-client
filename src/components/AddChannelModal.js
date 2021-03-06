import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { Formik, Form } from 'formik';
import Grid from '@material-ui/core/Grid';
import CustomTextField from '../components/CustomTextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { GET_ME } from '../graphql/teams';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import findIndex from 'lodash/findIndex';
import MultiSelectUsers from './MultiSelectUsers';

const CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
      ok
      channel {
        id
        name
        dm
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

const AddChannelSchema = Yup.object().shape({
  channel: Yup.string().required('Please enter a team name.'),
});

export default function AddChannelModal({ teamId, open, onClose, currentUserId }) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedA: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const [createChannel] = useMutation(CREATE_CHANNEL, {
    update: (cache, { data: { createChannel } }) => {
      const { ok, channel } = createChannel;

      if (!ok) {
        return;
      }

      const data = cache.readQuery({ query: GET_ME });
      const teamIndex = findIndex(data.me.teams, ['id', teamId]);
      data.me.teams[teamIndex].channels.push(channel);

      cache.writeQuery({
        query: GET_ME,
        data: data,
      });
    },
  });

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => {
          onClose();
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
              <CloseIcon
                className={classes.closeIcon}
                onClick={() => {
                  onClose();
                }}
              ></CloseIcon>
              <Typography variant="h4" align="left" color="textPrimary" gutterBottom>
                Create a channel
              </Typography>
              <Typography variant="subtitle1" align="left" color="textSecondary" component="p">
                Channels are where your team communicates.
              </Typography>
            </Container>
            <Formik
              initialValues={{ channel: '', public: true, members: [] }}
              validationSchema={AddChannelSchema}
              onSubmit={(values, { props, setSubmitting, setFieldError }) => {
                setTimeout(async () => {
                  const membersIdArr = values.members.map((m) => m.id);
                  teamId = parseInt(teamId);
                  await createChannel({
                    optimisticResponse: {
                      createChannel: {
                        __typename: 'Mutation',
                        ok: true,
                        channel: {
                          __typename: 'Channel',
                          id: -1,
                          name: values.channel,
                          dm: false,
                        },
                      },
                    },
                    variables: {
                      teamId,
                      name: values.channel,
                      public: values.public,
                      members: membersIdArr,
                    },
                  });
                  setSubmitting(false);
                  onClose();
                  // const { ok, errors, channel} = response.data.createChannel;
                  // if (ok) {
                  //   console.log(response)
                  //   setSubmitting(false);
                  // } else {
                  //   console.log
                  //   console.log(errors)
                  //   setFieldError('general', errors[0].message);
                  //   setSubmitting(false);
                  //   setTimeout(() => {
                  //   }, 5000);
                  // }
                }, 400);
              }}
            >
              {({ values, errors, isSubmitting, resetForm, setFieldValue }) => (
                <Form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomTextField
                        style={{ width: 500 }}
                        id="channel"
                        name="channel"
                        type="input"
                        label="Channel"
                      />
                    </Grid>
                  </Grid>
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!values.public}
                          onChange={() => setFieldValue('public', !values.public)}
                        />
                      }
                      label="Private Channel"
                    />
                    {values.public ? null : (
                      <MultiSelectUsers
                        value={values.members}
                        handleChange={(e, value) => setFieldValue('members', value)}
                        teamId={teamId}
                        placeholder="Select team members"
                        currentUserId={currentUserId}
                      ></MultiSelectUsers>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className={classes.submit}
                  >
                    Create
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
