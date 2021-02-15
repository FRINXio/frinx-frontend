import React from 'react';
import { Button, Box, Text, Icon } from "@chakra-ui/react"
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import JobItem from './job-item';
import './index.css';

const mockJobArray = [
    {
        jobId: "1",
        status: 'inprogress',
        eta: '2h 15min',
        status2: 'finished scanning',
        started: '12h ago',
    },
    {
        jobId: "2",
        status: 'completed',
        eta: '2h 15min',
        status2: 'finished scanning',
        started: '12h ago',
    },
    {
        jobId: "3",
        status: 'inprogress',
        eta: '15min',
        status2: 'found 13 devices',
        started: '2 days ago',
    },
    {
        jobId: "4",
        status: 'failed',
        eta: '2h 15min',
        status2: 'finished scanning',
        started: '12h ago',
    }
]

type DeviceDiscoveryAppProps = {
    onNewJobClick: Function
}

const DeviceDiscoveryApp = ({ onNewJobClick } : DeviceDiscoveryAppProps) => {
    return (
        <div className="App">
            <Box padding="12px 50px 12px 50px">
                <Box 
                    marginBottom="24px" 
                    display="flex" 
                    justifyContent="space-between"
                    >
                    <Text fontSize={32}> Device Discovery </Text>
                    <Button bg="brand.500" color="white" onClick={() => {onNewJobClick()}}><AddIcon marginRight="8px"/> Start New Job </Button>
                </Box>
                <Box>
                    { mockJobArray.map((e) => {
                        return <JobItem 
                            key={e.jobId}
                            jobId={ e.jobId }
                            status={ e.status }
                            eta={ e.eta }
                            status2={ e.status2 }
                            started={ e.started }
                            
                        />
                    }) }
                </Box>
            </Box>
        </div>
    );
}

export default DeviceDiscoveryApp;
