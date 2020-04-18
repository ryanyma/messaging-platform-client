import React from 'react';
import styled from 'styled-components';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #2f3136;
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
    background: #36393f;
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
  color: #72767d;
`;

const StyledHref = styled.a`
  text-decoration: none;
  color: #72767d;
`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const channel = ({ id, name }, teamId) => (
  <StyledLink key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
    <SideBarListItem># {name}</SideBarListItem>
  </StyledLink>
);

const dmChannel = ({ id, name }, teamId) => (
  <SideBarListItem key={`user-${id}`}>
    <StyledLink to={`/view-team/${teamId}/${id}`}>
      <Bubble /> {name}
    </StyledLink>
  </SideBarListItem>
);

export default ({
  teamName,
  username,
  channels,
  dmChannels,
  onAddChannelClick,
  onInvitePeopleClick,
  onDirectMessageClick,
  teamId,
  isOwner,
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
        {channels.map((c) => channel(c, teamId))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Direct Messages{' '}
          <AddCircleOutlineIcon onClick={onDirectMessageClick}></AddCircleOutlineIcon>
        </SideBarListHeader>
        {dmChannels.map((dmC) => dmChannel(dmC, teamId))}
      </SideBarList>
    </div>
    {isOwner && (
      <div>
        <StyledHref href="#invite-people" onClick={onInvitePeopleClick}>
          + Invite people
        </StyledHref>
        {/* <a href="#invite-people" onClick={onInvitePeopleClick}>
          + Invite people
        </a> */}
      </div>
    )}
  </ChannelWrapper>
);
