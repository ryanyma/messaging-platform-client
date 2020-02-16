import React from 'react';
import styled from 'styled-components';
import InputWithIcon from './Input';
import { Input } from '@material-ui/core';

const Wrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const StyledInput = styled(Input)`
    width: 750px;
`;

export default ({ channelName }) => (
  <Wrapper>
    <StyledInput placeholder={`Message #${channelName}`}/>
  </Wrapper>
);
