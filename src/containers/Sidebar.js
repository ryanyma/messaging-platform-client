import React from 'react';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import decode from 'jwt-decode';

export default function Sidebar(props) {
  const [openChannelModal, setChannelModalOpen] = React.useState(false);
  const [openInviteModal, setInviteModalOpen] = React.useState(false);

  const { teams, team } = props;

  let username = '';
  let isOwner = false;

  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    username = user.username;
    isOwner = user.id === team.owner
  } catch (err) {}

  return (
    <React.Fragment>
      <Teams teams={teams} />
      <Channels
        teamName={team.name}
        username={username}
        teamId={team.id}
        isOwner={isOwner}
        channels={team.channels}
        users={[
          { id: 1, name: 'slackbot' },
          { id: 2, name: 'user1' }
        ]}
        onAddChannelClick={() => setChannelModalOpen(true)}
        onInvitePeopleClick={() => setInviteModalOpen(true)}
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
    </React.Fragment>
  );
}
