import React, { FC, useEffect, useState } from 'react';
import { Route, Switch, useHistory} from 'react-router-dom';
//


const ServicesApp: FC = () => {
    const [components, setComponents] = useState<typeof import('@frinx/services-ui') | null>(null);
    const history = useHistory();

    useEffect(() => {
        import('@frinx/services-ui').then((mod) => {
            const {
                DeviceDiscoveryApp,
                ScanPage,
                FoundOnNetworkPage
            } = mod;
            setComponents({
                DeviceDiscoveryApp,
                ScanPage,
                FoundOnNetworkPage
            });
        });
    }, []);

    if (components == null) {
        return null;
    }

    const {
        DeviceDiscoveryApp,
        ScanPage,
        FoundOnNetworkPage
    } = components;

    return (
        <Switch>
            <Route exact path="/services/">
                <DeviceDiscoveryApp
                    onNewJobClick={() => {
                        history.push('/services/scan');
                        return
                    }}
                />
            </Route>
            <Route exact path="/services/scan">
                <ScanPage
                    onStartScanClick={() => {
                            history.push('/services/results');
                            return
                    }} />
            </Route>
            <Route exact path="/services/results">
                <FoundOnNetworkPage />
            </Route>
        </Switch>
    );
};

export default ServicesApp;
