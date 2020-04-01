import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import DirectMessageContainerView from './DirectMessageContainerView';

const GET_DIRECT_MESSAGES = gql`
  query($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      text
      sender {
        username
      }
      createdAt
    }
  }
`;
const DIRECT_MESSAGE_SUBSCRIPTION = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

export default function DirectMessageContainer({ teamId, userId }) {
  const { loading, error, data, subscribeToMore } = useQuery(GET_DIRECT_MESSAGES, {
    variables: {
      teamId: teamId,
      userId: parseInt(userId, 10)
    },
    options: {
      fetchPolicy: 'network-only'
    }
  });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  console.log(data);
  console.log(subscribeToMore);
  const _subscribeToNewMessages = () => {
    const unsubscribe = subscribeToMore({
      document: DIRECT_MESSAGE_SUBSCRIPTION,
      variables: {
        teamId: teamId,
        userId: userId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        console.log(prev, subscriptionData);
        return {
          ...prev,
          directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage]
        };
      }
    });
    return unsubscribe;
  };

  return (
    <DirectMessageContainerView
      data={data}
      subscribeToMore={_subscribeToNewMessages}
    ></DirectMessageContainerView>
  );
}
