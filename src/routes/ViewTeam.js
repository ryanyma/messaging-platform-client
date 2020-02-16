import React from 'react';
import Channels from '../components/Channels';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Messages from '../components/Messages';
import AppLayout from '../components/AppLayout';
import Teams from '../components/Teams';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ match: { params } }) => (
  <AppLayout>
    <Header channelName="general">Header</Header>
    <Sidebar currentTeamId={params.teamId}/>
    <Messages>
      <ul className="message-list">
        <li></li>
        <li></li>
      </ul>
    </Messages>
    <SendMessage channelName="general"/>
  </AppLayout>
);

export default ViewTeam;
