import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

const ServicesApp: FC = () => {
    const [components, setComponents] = useState<typeof import('@frinx/services-ui') | null>(null);
    const history = useHistory();

    useEffect(() => {
        import('@frinx/services-ui').then((mod) => {
            const {
                DeviceDiscoveryApp,
                ScanPage,
                FoundOnNetworkPage,
                ServicesWrapper
            } = mod;
            setComponents({
                DeviceDiscoveryApp,
                ScanPage,
                FoundOnNetworkPage,
                ServicesWrapper
            });
        });
    }, []);

    if (components == null) {
        return null;
    }

    const {
        DeviceDiscoveryApp,
        ScanPage,
        FoundOnNetworkPage,
        ServicesWrapper
    } = components;

    return (
        <ServicesWrapper>
            <Switch>
                <Route exact path="/services/">
                    <DeviceDiscoveryApp
                        onNewJobClick={() => {
                            history.push('/services/scan');
                        }}
                    />
                </Route>
                <Route exact path="/services/scan">
                    <ScanPage
                        onStartScanClick={() => {
                            history.push('/services/results');
                        }} />
                </Route>
                <Route exact path="/services/results">
                    <FoundOnNetworkPage />
                </Route>
            </Switch>
        </ServicesWrapper>
    );
};

export default ServicesApp;
