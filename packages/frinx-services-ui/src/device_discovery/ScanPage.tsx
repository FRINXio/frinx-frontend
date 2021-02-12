import React from 'react';
import InputMask from "react-input-mask";
import { Button, Box, Text, Input, Divider } from "@chakra-ui/react"

type ScanPageProps = {
    onStartScanClick: Function
}

const ScanPage = ({onStartScanClick} : ScanPageProps) => {
    const firstLetter = /(?!.*[DFIOQU])[A-VXY]/i;
    const letter = /(?!.*[DFIOQU])[A-Z]/i;
    const digit = /[0-9]/;
    const mask = [firstLetter, digit, letter, " ", digit, letter, digit];
    return (
        <div className="App">
            <Box padding="50px">
                <Box 
                    borderWidth="1px"
                    bg="white"
                    borderColor="#000000"
                    borderRadius="5px"
                    padding="20px" 
                    marginBottom="10px"
                    >
                        <Text fontSize={28}>Scan the network</Text>
                        <Divider />
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
                                <Button 
                                    bg="brand.500" 
                                    color="white" 
                                    width="150px" 
                                    onClick={() => {onStartScanClick()}}>Start scanning</Button>
                        </Box>
                </Box>
            </Box>
        </div>
    );
}

export default ScanPage;
