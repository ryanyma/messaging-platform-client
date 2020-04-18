import React, { useEffect, createRef, useState } from 'react';
import Messages from '../components/Messages';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FileUpload from '../components/FileUpload';
import RenderText from '../components/RenderText';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#36393f',
  },
  inline: {
    display: 'inline',
  },
}));

const Message = ({ message: { url, style, text, filetype } }) => {
  if (url) {
    if (filetype.startsWith('image/')) {
      return <img src={url} alt="" />;
    } else if (filetype === 'text/plain') {
      return <RenderText url={url} />;
    } else if (filetype.startsWith('audio/')) {
      return (
        <div>
          <audio controls>
            <source src={url} type={filetype} />
          </audio>
        </div>
      );
    }
  }
  return <span>{text}</span>;
};
export default function MessageContainerView({
  data,
  hasMore,
  loadMore,
  subscribeToMore,
  channelId,
}) {
  const classes = useStyles();
  let scroller = createRef();

  const messages = data.getMessages;
  const [prevMessages, setMessages] = useState([]);
  useEffect(() => {
    const unsubscribe = subscribeToMore();
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (prevMessages.length > 0 && messages && messages[0].id !== prevMessages[0].id) {
      console.log('fuckkk');
      scroller.current.scrollTop = scroller.current.scrollHeight - scroller.current.clientHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    console.log(messages);
    if (
      scroller &&
      scroller.current.scrollTop < 100 &&
      hasMore &&
      messages.length >= 35 &&
      prevMessages.length !== messages.length
    ) {
      setMessages(messages);
      loadMore();
    }
  };

  return (
    <Messages onScroll={handleScroll} ref={scroller}>
      <FileUpload
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        disableClick
        channelId={channelId}
      >
        <List className={classes.root}>
          {messages
            .slice()
            .reverse()
            .map((m) => (
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
                      <Message message={m} />
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
        </List>
      </FileUpload>
    </Messages>
  );
}
