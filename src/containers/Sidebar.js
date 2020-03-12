import React from 'react';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';

import decode from 'jwt-decode';

export default function Sidebar(props) {
  const [openChannelModal, setChannelModalOpen] = React.useState(false);
  const [openInviteModal, setInviteModalOpen] = React.useState(false);
  const [openDirectMessageModal, setDirectMessageModalOpen] = React.useState(false);

  const { teams, team, username } = props;

  return (
    <React.Fragment>
      <Teams teams={teams} />
      <Channels
        teamName={team.name}
        username={username}
        teamId={team.id}
        isOwner={team.admin}
        channels={team.channels}
        users={[
          { id: 1, name: 'slackbot' },
          { id: 2, name: 'user1' }
        ]}
        onAddChannelClick={() => setChannelModalOpen(true)}
        onInvitePeopleClick={() => setInviteModalOpen(true)}
        onDirectMessageClick={() => setDirectMessageModalOpen(true)}
      />
      <AddChannelModal
        teamId={team.id}
        onClose={() => setChannelModalOpen(false)}
        open={openChannelModal}
        key="sidebar-add-channel-modal"
      ></AddChannelModal>
      <InvitePeopleModal
        teamId={team.id}
        onClose={() => setInviteModalOpen(false)}
        open={openInviteModal}
        key="sidebar-invite-people-modal"
      ></InvitePeopleModal>
      <DirectMessageModal
        teamId={team.id}
        onClose={() => setDirectMessageModalOpen(false)}
        open={openDirectMessageModal}
        key="sidebar-direct-message-modal"
      ></DirectMessageModal>
    </React.Fragment>
  );
}
