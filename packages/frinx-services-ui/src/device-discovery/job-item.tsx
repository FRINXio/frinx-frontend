import { PhoneIcon, SettingsIcon } from '@chakra-ui/icons';
import { Box, Button, CircularProgress, Flex, Icon, Tag, Text } from '@chakra-ui/react';
import { faBan, faCheckCircle, faEllipsisV, faLink, faRedo, faSignature, faTimesCircle, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';

type JobItemProps = {
    jobId: String,
    status: String,
    eta: String,
    status2: String,
    started: String,
}

const JobItem = ({jobId, status, eta, status2, started} : JobItemProps) => {



    const getStatusColor = (status: String) => {
        switch(status) {
            case 'completed':
                return '#9ccc65';
            case 'inprogress':
                return 'brand.500'
            case 'failed':
                return '#ff7043'
        }
    }

    const getButtonText = (status: String) => {
        switch(status) {
            case 'completed':
                return 'VIEW';
            case 'inprogress':
                return 'CANCEL'
            case 'failed':
                return 'RETRY'
        }
    }

    const getButtonIcon = (status: String) => {
        switch(status) {
            case 'completed':
                return faLink;
            case 'inprogress':
                return faBan;
            case 'failed':
                return faUndo;
        }
    }

    const getButtonColor = (status: String) => {
        switch(status) {
            case 'completed':
                return '#9ccc65';
            case 'inprogress':
                return 'blue'
            case 'failed':
                return 'red'
        }
    }

    const getStatusIcon = (status: String) => {
        switch(status) {
            case 'completed':
                return <Icon as={FontAwesomeIcon} icon={faCheckCircle} size="lg" color="green.300" />
            case 'inprogress':
                return <CircularProgress isIndeterminate color="brand.500" size="20px" />
            case 'failed':
                return <Icon as={FontAwesomeIcon} icon={faTimesCircle} size="lg" color="#ff7043"  />
            default:
                return <Icon as={FontAwesomeIcon} icon={faTimesCircle} size="lg" color="#ff7043"  />
        }
    }

    return (
        <Box
            borderWidth="0px"
            bg="white"
            boxShadow=" 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);"
            borderRadius="5px"
            padding="20px"
            marginBottom="10px"
            display="grid"
            alignItems="center"
            gridTemplateColumns=" 50px 100px 40px 200px 200px auto 155px ">
                <Icon as={FontAwesomeIcon} icon={faSignature} marginRight="8px" />
                { jobId }
                { getStatusIcon(status) }
                <div>
                    <Tag variant="solid" width="90px" bg={getStatusColor(status)} display="flex" justifyContent="center"> { status } </Tag>
                    <Box marginTop="8px">
                        ETA : { eta }
                    </Box>

                </div>

                <div>{ status2 }</div>
                <Text color="#a1a1a1">{ started }</Text>
                <Flex alignItems="flex-end" justifyContent="flex-end">
                    {/*<Button variant="outline" colorScheme={getButtonColor(status)} marginRight="12px" width="120px">*/}
                    {/*    <Icon as={FontAwesomeIcon} icon={getButtonIcon(status)} marginRight="8px" />*/}
                    {/*    {getButtonText(status)} */}
                    {/*</Button>*/}
                    <Icon as={FontAwesomeIcon} icon={faEllipsisV} marginRight="8px" />
                </Flex>

        </Box>
    );
}

export default JobItem;
