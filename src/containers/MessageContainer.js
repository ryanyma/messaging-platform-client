import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import MessageContainerView from './MessageContainerView';

const GET_MESSAGES = gql`
  query($cursor: String, $channelId: Int!) {
    getMessages(cursor: $cursor, channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
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
      url
      filetype
      createdAt
    }
  }
`;
export default function MessageContainer({ channelId }) {
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: {
      channelId: channelId,
    },
    fetchPolicy: 'network-only',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const messages = data.getMessages;

  const _loadMore = () => {
    return fetchMore({
      query: GET_MESSAGES,
      notifyOnNetworkStatusChange: true,
      variables: {
        channelId: channelId,
        cursor: messages[messages.length - 1].createdAt,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        if (fetchMoreResult.getMessages.length < 35) {
          setHasMore(false);
        }
        // console.log(previousResult.getMessages);
        // console.log('sep');
        // console.log(fetchMoreResult.getMessages);

        return {
          ...previousResult,
          getMessages: [...previousResult.getMessages, ...fetchMoreResult.getMessages],
        };
      },
    });
  };

  const _subscribeToNewMessages = () => {
    const unsubscribe = subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: {
        channelId: channelId,
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
          getMessages: [subscriptionData.data.newChannelMessage, ...prev.getMessages],
        };
      },
    });
    return unsubscribe;
  };

  return (
    <MessageContainerView
      data={data}
      loadMore={_loadMore}
      hasMore={hasMore}
      subscribeToMore={_subscribeToNewMessages}
      channelId={channelId}
    ></MessageContainerView>
  );
}
