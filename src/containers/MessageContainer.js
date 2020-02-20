import React from 'react';
import Messages from '../components/Messages';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const GET_MESSAGES = gql`
  query($channelId: Int!) {
    getMessages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: '#F7F8FB'
  },
  inline: {
    display: 'inline'
  }
}));

export default function MessageContainer({ channelId }) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: {
      channelId: channelId
    }
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  console.log(data.getMessages);
  const messages = data.getMessages;

  return (
    <Messages>
      <List className={classes.root}>
        {messages.map(m => (
          <ListItem key={`${m.id}-message`} alignItems="flex-start">
            {/* <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar> */}
            <ListItemText
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {m.user.username}{' '}
                    {new Date(parseInt(m.createdAt, 10)).toString()}
                  </Typography>
                  <br></br>
                  {`${m.text}`}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Messages>
  );
}
