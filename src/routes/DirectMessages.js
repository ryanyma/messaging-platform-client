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

const GET_DM_ME_QUERY = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;
// const queryMultiple = () => {
//   const responseOne = useQuery(GET_ME);
//   const responseTwo = useQuery(GET_DM_ME_QUERY);
//   return [responseOne, responseTwo];
// };
export default function DirectMessages({
  match: {
    params: { teamId, userId }
  }
}) {
  const { loading, error, data } = useQuery(GET_DM_ME_QUERY, {
    variables: {
      userId: parseInt(userId, 10)
    }
  });
  const [createDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE, {
    update: cache => {
      const dataRead = cache.readQuery({ query: GET_ME });
      const index = findIndex(dataRead.me.teams, ['id', team.id]);

      const userNotExists = dataRead.me.teams[index].directMessageMembers.every(
        member => member.id !== parseInt(userId, 10)
      );
      if (userNotExists) {
        dataRead.me.teams[index].directMessageMembers.push({
          __typename: 'User',
          id: userId,
          username: data.getUser.username
        });

        cache.writeQuery({
          query: GET_ME,
          data: dataRead
        });
      }
    }
  });
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

  const teamIdInt = parseInt(teamId, 10);

  if (teamIdInt) {
    teamIndex = findIndex(teams, ['id', teamIdInt]);
  }

  if (teamIndex === -1) {
    teamIndex = 0;
  }

  const team = teams[teamIndex];
  userId = parseInt(userId, 10);
  teamId = parseInt(teamId, 10);

  return (
    <AppLayout>
      <Header channelName={data.getUser.username}>Header</Header>
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
          await createDirectMessage({
            optimisticResponse: {
              createDirectMessage: true
            },
            variables: { text, receiverId: userId, teamId }
          });
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
}
