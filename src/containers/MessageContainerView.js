import React, { useEffect } from 'react';
import Messages from '../components/Messages';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: '#F7F8FB'
  },
  inline: {
    display: 'inline'
  }
}));

export default function MessageContainerView({ data, subscribeToMore }) {
  useEffect(() => {
    const unsubscribe = subscribeToMore();
    return () => {
      unsubscribe();
    };
  });

  console.log(data);
  const classes = useStyles();
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
                    {m.user.username} {new Date(parseInt(m.createdAt, 10)).toString()}
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