import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import MessageContainerView from './MessageContainerView';
const GET_MESSAGES = gql`
  query($channelId: Int!) {
    getMessages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;
export default function MessageContainer({ channelId }) {
  const { loading, error, data, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: {
      channelId: channelId
    },
    fetchPolicy: 'network-only'
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const _subscribeToNewMessages = () => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: {
        channelId: channelId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        // console.log(prev);
        // return Object.assign({}, prev, {
        //     entry: {
        //       comments: [newFeedItem, ...prev.entry.comme
        return {
          ...prev,
          getMessages: [...prev.getMessages, subscriptionData.data.newChannelMessage]
        };
      }
    });
    return unsubscribe;
  };

  return (
    <MessageContainerView
      data={data}
      subscribeToMore={_subscribeToNewMessages}
    ></MessageContainerView>
  );
}
