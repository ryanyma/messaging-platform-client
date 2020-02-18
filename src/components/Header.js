import React from 'react';
import DenseAppBar from './AppBar';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

export default ({ channelName }) => (
  <HeaderWrapper>
    <DenseAppBar channelName={channelName}></DenseAppBar>
  </HeaderWrapper>
);
