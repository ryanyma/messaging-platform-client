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

// const MESSAGE_SUBSCRIPTION = gql`
//   subscription($channelId: Int!) {
//     newChannelMessage(channelId: $channelId) {
//       id
//       text
//       user {
//         username
//       }
//       createdAt
//     }
//   }
// `;
export default function DirectMessageContainer({ teamId, userId }) {
  const { loading, error, data } = useQuery(GET_DIRECT_MESSAGES, {
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

  //   const _subscribeToNewMessages = () => {
  //     const unsubscribe = subscribeToMore({
  //       document: MESSAGE_SUBSCRIPTION,
  //       variables: {
  //         channelId: channelId
  //       },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData) {
  //           return prev;
  //         }
  //         // console.log(prev);
  //         // return Object.assign({}, prev, {
  //         //     entry: {
  //         //       comments: [newFeedItem, ...prev.entry.comme
  //         return {
  //           ...prev,
  //           getMessages: [...prev.getDirectMessages, subscriptionData.data.newChannelMessage]
  //         };
  //       }
  //     });
  //     return unsubscribe;
  //   };

  return (
    <DirectMessageContainerView
      data={data}
      //   subscribeToMore={_subscribeToNewMessages}
    ></DirectMessageContainerView>
  );
}
