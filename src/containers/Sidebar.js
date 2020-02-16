import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';

const GET_ALL_TEAMS = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;


const Sidebar = (params) => {
    const { loading, error, data } = useQuery(GET_ALL_TEAMS);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    
    const allTeams = data.allTeams;
    let teamIndex = 0;

    if (params.currentTeamId) {
      teamIndex = findIndex(allTeams, ['id', parseInt(params.currentTeamId, 10)])
    }

    const team = allTeams[teamIndex];

    let username = '';
    try {
        const token = localStorage.getItem('token');
        let user = decode(token);
        username = user.username;
    } catch (err) {

    }

    return (
        <React.Fragment>
            <Teams teams={data.allTeams.map(team => ({
                id: team.id,
                letter: team.name.charAt(0).toUpperCase(),
            }))} />
            <Channels
                teamName={team.name}
                username={username}
                channels={team.channels}
                users={[
                { id: 1, name: 'slackbot' },
                { id: 2, name: 'user1' }
                ]}
            />
        </React.Fragment>
    );
};

export default Sidebar