import React from 'react';
import Channels from '../components/Channels';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';
import AppLayout from '../components/AppLayout';
import Teams from '../components/Teams';
import Sidebar from '../containers/Sidebar';
import { GET_ME } from '../graphql/teams';
import { useQuery } from '@apollo/react-hooks';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import MessageContainer from '../containers/MessageContainer';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const CREATE_MESSAGE = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default function ViewTeam({
  match: {
    params: { teamId, channelId },
  },
}) {
  const [createMessage] = useMutation(CREATE_MESSAGE);
  const { loading, error, data } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const { username, teams } = data.me;

  if (!teams.length) {
    return (
      <Redirect
        to={{
          pathname: '/create-team',
        }}
      />
    );
  }

  let teamIndex = 0;
  let channelIndex = 0;

  const teamIdInt = parseInt(teamId, 10);

  if (teamIdInt) {
    teamIndex = findIndex(teams, ['id', teamIdInt]);
  }

  if (teamIndex === -1) {
    teamIndex = 0;
  }

  const team = teams[teamIndex];
  const channelIdInt = parseInt(channelId, 10);

  if (channelIdInt) {
    channelIndex = findIndex(team.channels, ['id', channelIdInt]);
  }

  if (channelIndex === -1) {
    channelIndex = 0;
  }
  const channel = team.channels[channelIndex];

  return (
    <AppLayout>
      {channel && <Header channelName={channel.name}>Header</Header>}
      <Sidebar
        teams={teams.map((team) => ({
          id: team.id,
          letter: team.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={username}
      />
      {channel && <MessageContainer channelId={channel.id} />}
      {channel && (
        <SendMessage
          placeholder={channel.name}
          onSubmit={async (text) => {
            await createMessage({ variables: { text, channelId: channel.id } });
          }}
          channelId={channel.id}
        />
      )}
    </AppLayout>
  );
}
