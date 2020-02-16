import React from 'react';
import styled from 'styled-components';
import MenuAppBar from './AppBar';

const HeaderWrapper = styled.div`
    grid-column: 3;
    grid-row: 1;
`

export default ({channelName}) => (
    <HeaderWrapper>
        <MenuAppBar></MenuAppBar>
    </HeaderWrapper>
);