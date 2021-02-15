import { Box, Checkbox, Icon, Input, Select, Tag } from '@chakra-ui/react';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type FoundItemProps = {
    id: number,
    setCheckedItems: Function,
    checkedItems: Array<Object>,
}

const FoundItem = ({id, setCheckedItems, checkedItems} : FoundItemProps) => {
    return (
        <Box 
            borderWidth="0px"
            bg="white"
            boxShadow=" 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);"
            borderRadius="5px"
            padding="20px" 
            marginBottom="10px"
            display="grid"
            gridTemplateColumns=" 50px 100px 150px 150px 150px 150px auto 25px "
            gridColumnGap="25px"
            alignItems="center"
            >
                <Checkbox   onChange={(e) => {
                    setCheckedItems(id, e.target.checked)
                    }}/>
                10.1.1.1
                <Box>
                    <Box color="gray.500">
                        Protocol
                    </Box>
                    <Select >
                        <option value="NETCONF">NETCONF</option>
                        <option value="CLI">CLI</option>
                    </Select>
                </Box>
                
                <Box>
                    <Box color="gray.500">
                        Port
                    </Box>
                    <Input placeholder="Basic usage" aria-label="test" />
                </Box>
                
                <Box>
                    <Box color="gray.500">
                        username
                    </Box>
                    <Input placeholder="Basic usage" aria-label="test" />
                </Box>
                <Box>
                    <Box color="gray.500">
                        password
                    </Box>
                    <Input placeholder="Basic usage" aria-label="test" />
                </Box>
                <div />
                <Icon as={FontAwesomeIcon} icon={faEllipsisV} marginRight="8px" />
        </Box>
    );
}

export default FoundItem;
