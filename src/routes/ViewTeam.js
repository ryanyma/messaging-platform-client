import React from 'react';
import Channels from '../components/Channels';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';
import AppLayout from '../components/AppLayout';
import Teams from '../components/Teams';
import Sidebar from '../containers/Sidebar';
import { GET_ALL_TEAMS } from '../graphql/teams';
import { useQuery } from '@apollo/react-hooks';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

export default function ViewTeam({
  match: {
    params: { teamId, channelId }
  }
}) {
  const { loading, error, data } = useQuery(GET_ALL_TEAMS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const allTeams = data.allTeams;

  if (!allTeams.length) {
    return (
      <Redirect
        to={{
          pathname: '/create-team'
        }}
      />
    );
  }

  let teamIndex = 0;
  let channelIndex = 0;

  const teamIdInt = parseInt(teamId, 10);

  if (teamIdInt) {
    teamIndex = findIndex(allTeams, ['id', teamIdInt]);
  }

  const team = allTeams[teamIndex];
  const channelIdInt = parseInt(channelId, 10);

  if (channelIdInt) {
    channelIndex = findIndex(team.channels, ['id', channelIdInt]);
  }

  const channel = team.channels[channelIndex];

  return (
    <AppLayout>
      {channel && <Header channelName={channel.name}>Header</Header>}
      <Sidebar
        teams={allTeams.map(team => ({
          id: team.id,
          letter: team.name.charAt(0).toUpperCase()
        }))}
        team={team}
      />
      {channel && (
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li></li>
            <li></li>
          </ul>
        </Messages>
      )}
      {channel && <SendMessage channelName={channel.name} />}
    </AppLayout>
  );
}
