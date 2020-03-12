import React from 'react';
import styled from 'styled-components';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
  text-decoration: none;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = 'padding-left: 10px';

const SideBarListItem = styled.li`
  padding: 2px;
  text-decoration: none;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`
  text-decoration: none;
  ${paddingLeft};
`;

const PushLeft = styled.div`
  ${paddingLeft};
  text-decoration: none;
`;

const Green = styled.span`
  color: #38978d;
`;

const StyledGridContainer = styled(Grid)`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const channel = ({ id, name }, teamId) => (
  <StyledLink key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
    <SideBarListItem># {name}</SideBarListItem>
  </StyledLink>
);

const user = ({ id, name }) => (
  <SideBarListItem key={`user-${id}`}>
    <Bubble /> {name}
  </SideBarListItem>
);

export default ({
  teamName,
  username,
  channels,
  users,
  onAddChannelClick,
  onInvitePeopleClick,
  onDirectMessageClick,
  teamId,
  isOwner
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      {username}
    </PushLeft>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Channels{' '}
          {isOwner && <AddCircleOutlineIcon onClick={onAddChannelClick}></AddCircleOutlineIcon>}
        </SideBarListHeader>
        {channels.map(c => channel(c, teamId))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Direct Messages{' '}
          <AddCircleOutlineIcon onClick={onDirectMessageClick}></AddCircleOutlineIcon>
        </SideBarListHeader>
        {users.map(user)}
      </SideBarList>
    </div>
    {isOwner && (
      <div>
        <a href="#invite-people" onClick={onInvitePeopleClick}>
          + Invite people
        </a>
      </div>
    )}
  </ChannelWrapper>
);
