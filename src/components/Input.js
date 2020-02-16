import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  textField: {
    width: 550,
  }
}));

export default function InputWithIcon({channelName}) {
  const classes = useStyles();

  return (
    <div>
      <TextField
        className={clsx(classes.margin, classes.textField)}
        id="input-with-icon-textfield"
        label="TextField"
        placeholder={channelName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          )
        }}
      />
    </div>
  );
}
