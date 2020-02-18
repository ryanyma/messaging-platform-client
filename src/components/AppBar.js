import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#F7F8FB',
    boxShadow: 'none',
    alignItems: 'center',
  },
  typography: {
    color: 'black'

  }
}));

const StyledAppBar = styled(AppBar)`
  
`;



export default function DenseAppBar({channelName}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar variant="dense">
          <Typography className={classes.typography} variant="subtitle1">
            #{channelName}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}