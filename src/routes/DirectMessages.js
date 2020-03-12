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
import DirectMessageContainer from '../containers/DirectMessageContainer';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const CREATE_DIRECT_MESSAGE = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default function DirectMessages({
  match: {
    params: { teamId, userId }
  }
}) {
  const { loading, error, data } = useQuery(GET_ME, {
    fetchPolicy: 'network-only'
  });
  const [createDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE);
  console.log(teamId, userId);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const { username, teams } = data.me;

  if (!teams.length) {
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
    teamIndex = findIndex(teams, ['id', teamIdInt]);
  }

  if (teamIndex === -1) {
    teamIndex = 0;
  }

  const team = teams[teamIndex];
  console.log(typeof userId, typeof teamId);
  userId = parseInt(userId, 10);
  teamId = parseInt(teamId, 10);
  console.log(typeof userId, typeof teamId);

  return (
    <AppLayout>
      {/* <Header channelName={channel.name}>Header</Header> */}
      <Sidebar
        teams={teams.map(team => ({
          id: team.id,
          letter: team.name.charAt(0).toUpperCase()
        }))}
        team={team}
        username={username}
      />
      <DirectMessageContainer teamId={team.id} userId={userId} />
      <SendMessage
        onSubmit={async text => {
          await createDirectMessage({ variables: { text, receiverId: userId, teamId } });
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
}
