import React, { useEffect, useState } from 'react';
import { Button, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Text, Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import FoundItem from './found-item';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mockFoundArray = [
    {
        id: "1",
        status: 'inprogress',
        eta: '2h 15min',
        status2: 'finished scanning',
        started: '12h ago',
    },
    {
        id: "2",
        status: 'completed',
        eta: '2h 15min',
        status2: 'finished scanning',
        started: '12h ago',
    },
    {
        id: "3",
        status: 'inprogress',
        eta: '15min',
        status2: 'finished scanning',
        started: '2 days ago',
    },
    {
        id: "4",
        status: 'failed',
        eta: '2h 15min',
        status2: 'finished scanning',
        started: '12h ago',
    }
]

function FoundOnNetworkPage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showPassword, setShowPassword] = useState(false)

    const [checkedItems, setCheckedItems] = useState<Array<boolean>>([])

    const setCheckedItemsFunc = (id: number, value: boolean) => {
        var tmp = [...checkedItems]
        tmp[id] = value
        setCheckedItems(tmp)
    }

    return (
        <div className="App">
            <Box padding="12px 50px 12px 50px">
                <Box marginBottom="24px" display="flex" justifyContent="space-between">
                    <Text fontSize={32}> Found on network(3) </Text>
                    <Box display="flex">
                        <Button colorScheme="blue" variant="outline" onClick={onOpen} marginRight="12px">
                            <SettingsIcon marginRight="8px" /> 
                            Job Settings 
                        </Button>
                        <Button colorScheme="blue">
                            <Icon as={FontAwesomeIcon} icon={faPlay} marginRight="8px" />
                            Mount devices {checkedItems.filter((e) => e).length}
                        </Button>
                    </Box>
                </Box>
               
                <Box>
                    {[1, 2, 3].map((e, i) => {
                        return <FoundItem
                            key={e}
                            id={i}
                            setCheckedItems={setCheckedItemsFunc}
                            checkedItems={checkedItems}

                        />
                    })}
                </Box>

            </Box>



            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Job Settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Text color="gray.500">Default username</Text>
                            <Input placeholder="Enter username" aria-label="test" />
                        </Box>
                        <Box marginTop="25px">
                            <Text color="gray.500">Default password</Text>
                            <InputGroup size="md">
                                <Input
                                    pr="4.5rem"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "Hide" : "Show"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" variant="outline" mr={3} onClick={onClose}>
                            Apply settings
                        </Button>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default FoundOnNetworkPage;
