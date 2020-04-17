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

  const { teams, team, username, currentUserId } = props;

  const regChannels = [];
  const dmChannels = [];

  team.channels.forEach((c) => {
    if (c.dm) {
      dmChannels.push(c);
    } else {
      regChannels.push(c);
    }
  });
  console.log(team.channels);
  return (
    <React.Fragment>
      <Teams teams={teams} />
      <Channels
        teamName={team.name}
        username={username}
        teamId={team.id}
        isOwner={team.admin}
        channels={regChannels}
        dmChannels={dmChannels}
        onAddChannelClick={() => setChannelModalOpen(true)}
        onInvitePeopleClick={() => setInviteModalOpen(true)}
        onDirectMessageClick={() => setDirectMessageModalOpen(true)}
      />
      <AddChannelModal
        teamId={team.id}
        onClose={() => setChannelModalOpen(false)}
        open={openChannelModal}
        key="sidebar-add-channel-modal"
        currentUserId={currentUserId}
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
        currentUserId={currentUserId}
      ></DirectMessageModal>
    </React.Fragment>
  );
}
