import { Container } from '@chakra-ui/react';
import React, { ReactChildren, ReactChild } from 'react';

type ServicesWrapperProps = {
    children: ReactChild | ReactChildren
}

const ServicesWrapper = ({ children } : ServicesWrapperProps) => {
    return (
        <div className="App">
            <Container maxWidth={1280}>
                {children}
            </Container>
            
        </div>
    );
}

export default ServicesWrapper;
