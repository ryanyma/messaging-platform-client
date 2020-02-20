import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TeamWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362234;
  color: #958993;
`;

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = styled.li`
  text-decoration: none;

  &:focus, &:hover, &:visited, &:link, &:active {
      text-decoration: none;
  }
  height: 50px;
  width: 50px;
  text-decoration: none !important;
  background-color: #676066;
  color: #fff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 11px;
  &:hover {
    background-color: #676066;
    opacity: 0.5;
    color: #fff;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
  }
`;

const team = ({ id, letter }) => (
  <Link key={`team-${id}`} to={`/view-team/${id}`}>
    <TeamListItem>{letter}</TeamListItem>
  </Link>
);

export default ({ teams }) => (
  <TeamWrapper>
    <TeamList>{teams.map(team)}</TeamList>
  </TeamWrapper>
);
