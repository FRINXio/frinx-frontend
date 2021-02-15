import React from 'react';
import InputMask from "react-input-mask";
import { Button, Box, Text, Input, Divider, Container, Flex, Center } from "@chakra-ui/react"

type ScanPageProps = {
    onStartScanClick: Function
}

const ScanPage = ({onStartScanClick} : ScanPageProps) => {
    return (
        <div className="App">
            <Box 
                    display="flex" 
                    justifyContent="space-between"
                    >
                    <Text fontSize={32}>Scan the network</Text>
            </Box>
            <Flex justifyContent="center"   >
            <Box padding="50px" >
                
                <Box 
                    borderWidth="0px"
                    bg="white"
                    boxShadow=" 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);"
                    borderRadius="5px"
                    padding="20px" 
                    marginBottom="10px"
                    >
                        
                        <Box 
                            marginTop="24px"
                            display="grid"
                            gridTemplateColumns=" 250px auto"
                            gridColumnGap="25px"
                            gridTemplateRows="repeat(3, 50px)"
                            gridRowGap="15px">
                                <Text fontSize={18} textAlign="end">
                                    IP Range or CIPR: 
                                </Text>
                                <Input placeholder="10.0.0.0 - 10.0.0.255" aria-label="test" />

                                <Text fontSize={18} textAlign="end">
                                    Ports: 
                                </Text>
                                <Input placeholder="22, 23" aria-label="test" />

                                <Box />
                        </Box>
                        <Center><Button 
                                    bg="brand.500" 
                                    color="white" 
                                    width="150px" 
                                    onClick={() => {onStartScanClick()}}>Start scanning</Button></Center>
                </Box>
                
            </Box>
            </Flex>
            
        </div>
    );
}

export default ScanPage;
