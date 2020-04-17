import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { GET_TEAM_MEMBERS } from '../graphql/teams';
import TextField from '@material-ui/core/TextField';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  dropdown: {
    width: 500,
  },
}));

export default function MultiSelectUsers({ teamId, placeholder, handleChange, currentUserId }) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_TEAM_MEMBERS, {
    variables: {
      teamId: teamId,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const teamMembers = data.getTeamMembers.filter((tm) => tm.id !== currentUserId);
  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        onChange={handleChange}
        className={classes.dropdown}
        id="tags-standard"
        options={teamMembers}
        getOptionLabel={(option) => option.username}
        renderInput={(params) => (
          <TextField
            style={{ width: 500 }}
            {...params}
            variant="standard"
            placeholder={placeholder}
          />
        )}
      />
    </div>
  );
}
