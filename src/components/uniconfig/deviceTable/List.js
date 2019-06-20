import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Row, Table} from 'react-bootstrap'
import './List.css'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMinusCircle, faPlusCircle, faSync} from '@fortawesome/free-solid-svg-icons'
import MountModal from "./mountModal/MountModal";
import DetailModal from "./detailModal/DetailModal";
import PageSelect from "../../common/PageSelect";
import PageCount from "../../common/PageCount";

const http = require('../../../server/HttpServerSide').HttpClient;

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: "",
            data: [],
            table: [],
            highlight: [],
            selectedDevices: [],
            deviceDetails: [],
            mountModal: false,
            detailModal: false,
            defaultPages: 20,
            pagesCount: 1,
            viewedPage: 1,
            sort: false
        };
        library.add(faSync);
        this.table = React.createRef();
        this.onEditSearch = this.onEditSearch.bind(this);
        this.addDeviceEntry = this.addDeviceEntry.bind(this);
        this.showMountModal = this.showMountModal.bind(this);
        this.showDetailModal = this.showDetailModal.bind(this);
        this.sort = this.sort.bind(this);
    }

    componentWillMount() {
        this.search();
    }

    componentDidMount() {
        this.refreshAllDeviceEntries();
    }

    onEditSearch(event){
        this.setState({keywords: event.target.value}, () =>{
            this.search()
        })
    }

    async getDeviceEntry(node_id, topology){
        let os_version;
        let device_object = await this.getDeviceObject(node_id, topology);

        //append os/version from conf
        if (topology === "cli") {
            os_version = await http.get('/api/odl/conf/status/' + topology + "/" + node_id).then(res => {
                os_version = res["node"]["0"]["cli-topology:device-type"];
                os_version = os_version + " / " + res["node"]["0"]["cli-topology:device-version"];
                return os_version;
            })
        } else {
            os_version = "netconf"
        }

        return [device_object.node_id, device_object.host, device_object.status, os_version];
    }

    async addDeviceEntry(node_id, topology) {

        let entry = await this.getDeviceEntry(node_id, topology);
        let updated = false;
        let newData = this.state.data;

        //check if entry already exists -> update
        newData.map((device, i) => {
            if (device[0] === entry[0]) {
                newData[i] = entry;
                updated = true;
            }
            return updated;
        });

        if(!updated){
            newData.push(entry);
        }
        let pages = ~~(newData.length / this.state.defaultPages) + 1;

        this.setState({
            data: newData,
            pagesCount: pages
        })
    }

    onDeviceSelect(e){
        let checkboxID = e.target.id.split("-").pop();
        let node_id = document.querySelector(`#node_id-${checkboxID}`).innerText;
        let topology = document.querySelector(`#topology-${checkboxID}`).innerText;

        if(e.target.checked){
            this.state.selectedDevices.push({id: checkboxID, topology: topology, node_id: node_id});
        } else {
            for (let key in this.state.selectedDevices) {
                let id = this.state.selectedDevices[key].id;
                if (id !== e.target.id) {
                    this.state.selectedDevices.splice(key, 1);
                }
            }
        }
    }

    onDeviceRefresh(e) {

        let refreshBtnID = e.target.id;
        document.getElementById(refreshBtnID).classList.add('fa-spin');
        setTimeout(() => {
            document.getElementById(refreshBtnID).classList.remove('fa-spin')
        }, 1000);

        let refreshBtnIdx = e.target.id.split("-").pop();
        let node_id = document.querySelector(`#node_id-${refreshBtnIdx}`).innerText;
        let topology = document.querySelector(`#topology-${refreshBtnIdx}`).innerText;
        let updatedData = this.state.data;

        topology = topology === "netconf" ? "topology-netconf" : "cli";

        updatedData.map((device, i) => {
            if (device[0] === node_id) {
                return this.addDeviceEntry(node_id, topology)

            }
            return true;
        });

    }

    removeDevices() {
        this.state.selectedDevices.map(device => {
            if(device["topology"] === "netconf"){
                return http.delete('api/odl/unmount/topology-netconf/' + device["node_id"])
            } else {
                return http.delete('api/odl/unmount/cli/' + device["node_id"])
            }
        });
        this.setState({selectedDevices: []});
        setTimeout(this.refreshAllDeviceEntries.bind(this), 300);
    }

    refreshAllDeviceEntries() {
        this.setState({data: [], mountModal: false});
        http.get('/api/odl/oper/all/status/cli').then(res => {
           try {
               let topologies = Object.keys(res);
               let topology = Object.keys(res[Object.keys(res)]);
               let topology_id = res[topologies][topology]["topology-id"];
               let nodes = res[topologies][topology]["node"];

               if (nodes) {
                   nodes.map(device => {
                       let node_id = device["node-id"];
                       return this.addDeviceEntry(node_id, topology_id)
                   })
               }
           } catch (e) {
               console.log(e);
           }

        });

        http.get('/api/odl/oper/all/status/topology-netconf').then(res => {
            try {
                let topologies = Object.keys(res);
                let topology = Object.keys(res[Object.keys(res)]);
                let topology_id = res[topologies][topology]["topology-id"];
                let nodes = res[topologies][topology]["node"];

                if (nodes) {
                    nodes.map(device => {
                        let node_id = device["node-id"];
                        return this.addDeviceEntry(node_id, topology_id)
                    })
                }
            } catch (e) {
                console.log(e);
            }
        })
    }

    search() {
        let toBeRendered = [];
        let toBeHighlited = [];
        let query = this.state.keywords.toUpperCase();
        if(query !== ""){
            const rows = this.state.data;
            console.log(rows);
            for(let i = 0; i < rows.length; i++){
                for(let y = 0; y < rows[i].length; y++){
                    if(rows[i][y] && rows[i][y].toUpperCase().indexOf(query) !== -1){
                        toBeRendered.push(rows[i]);
                        toBeHighlited.push(y);
                        break
                    }
                }
            }
        } else {
            toBeRendered = this.state.data;
        }
        let pages = toBeRendered.length === 0 ? 0 : ~~(toBeRendered.length / this.state.defaultPages) + 1;

        this.setState({
            table: toBeRendered,
            highlight: toBeHighlited,
            pagesCount : pages
        })
    }

    calculateHighlight(i, y) {
        if(this.state.highlight[i] === y) {
            return 'hilit'
        } else {
            return ''
        }
    }

    showMountModal(){
        this.setState({
            mountModal: !this.state.mountModal,
        })
    }

    showDetailModal() {
        this.setState({
            detailModal: !this.state.detailModal,
        })
    }

    getDeviceObject(node_id, topology) {
        let topology_obj = topology === "cli" ? "cli-topology" : "netconf-node-topology";
        return http.get("/api/odl/oper/status/" + topology + "/" + node_id).then(res => {
            try {
                let device = res.node[0];
                let node_id = device["node-id"];
                let host = device[`${topology_obj}:host`];
                let a_cap = device[`${topology_obj}:available-capabilities`];
                let u_cap = device[`${topology_obj}:unavailable-capabilities`] || null;
                let status = device[`${topology_obj}:connection-status`];
                let port = device[`${topology_obj}:port`];
                let err_patterns = device[`${topology_obj}:default-error-patterns`] || null;
                let commit_patterns = device[`${topology_obj}:default-commit-error-patterns`] || null;
                let connected_message = device[`${topology_obj}:connected-message`] || null;

                return http.get("/api/odl/conf/status/" + topology + "/" + node_id).then(res => {
                    let device = res.node[0];
                    let transport_type = device[`${topology_obj}:transport-type`] || device[`${topology_obj}:tcp-only`];
                    let protocol = topology_obj.split("-")[0];

                    return {
                        node_id: node_id,
                        host: host,
                        a_cap: a_cap,
                        u_cap: u_cap,
                        status: status,
                        port: port,
                        err_patterns: err_patterns,
                        commit_patterns: commit_patterns,
                        topology: topology,
                        transport_type: transport_type,
                        protocol: protocol,
                        connected_message: connected_message
                    };
                });
            } catch (e) {
                console.log(e);
            }
        })
    }


    async getDeviceDetails(e) {

        let row_idx = e.target.id.split("-").pop();
        let node_id = document.querySelector(`#node_id-${row_idx}`).innerText;
        let topology = document.querySelector(`#topology-${row_idx}`).innerText;
        topology = topology === "netconf" ? "topology-netconf" : "cli";
        let deviceObject = await this.getDeviceObject(node_id, topology);
        this.setState({
            deviceDetails: deviceObject,
        });

        this.showDetailModal();
    }

    repeat(){
        let output = [];
        let highlight;
        let dataset;
        let defaultPages = this.state.defaultPages;
        let viewedPage = this.state.viewedPage;
        if(this.state.keywords === ""){
            dataset = this.state.data;
            highlight = false
        } else {
            dataset = this.state.table;
            highlight = true
        }
        for(let i = 0; i < dataset.length; i++){
            if(i >= (viewedPage-1) * defaultPages && i < viewedPage * defaultPages) {
                output.push(
                    <tr key={`row-${i}`} id={`row-${i}`}>
                        <td className=''><Form.Check type="checkbox" onChange={(e) => this.onDeviceSelect(e)} id={`chb-${i}`}/></td>
                        <td id={`node_id-${i}`} onClick={(e) => this.getDeviceDetails(e)}
                            className={highlight ? this.calculateHighlight(i, 0) + ' clickable btn-outline-primary' : 'clickable btn-outline-primary'}>{dataset[i][0]}</td>
                        <td className={highlight ? this.calculateHighlight(i, 1) : ''}>{dataset[i][1]}</td>
                        <td style={dataset[i][2] === "connected" ? {color: "#007bff"} : {color: "lightblue"}}
                            className={highlight ? this.calculateHighlight(i, 2) : ''}>{dataset[i][2]}
                            &nbsp;&nbsp;<i id={`refreshBtn-${i}`} onClick={(e) => this.onDeviceRefresh(e)}
                                           style={{color: "#007bff"}} className="fas fa-sync-alt fa-xs clickable"/></td>
                        <td id={`topology-${i}`} className={highlight ? this.calculateHighlight(i, 3) : ''}>{dataset[i][3]}</td>
                        <td><Button className="noshadow" variant="outline-primary" onClick={() => {
                            this.props.history.push("/devices/edit/" + dataset[i][0]);
                        }} size="sm"><i className="fas fa-cog"/></Button>
                        </td>
                    </tr>)
            }
        }
        return output
    }

    sort(i){
        let dataset;
        let sort = this.state.sort;
        this.state.keywords === "" ?  dataset = this.state.data : dataset = this.state.table;
        if (sort) {
            dataset.sort((a, b) => (a[i] > b[i]) ? 1 : ((b[i] > a[i]) ? -1 : 0));
        } else {
            dataset.sort((a, b) => (a[i] <= b[i]) ? 1 : ((b[i] < a[i]) ? -1 : 0));
        }
        this.setState({
            [this.state.keywords === "" ? "data" : "table"]: dataset,
            sort: !sort
        });
    }

    setCountPages(defaultPages, pagesCount){
        this.setState({
            defaultPages : defaultPages,
            pagesCount: pagesCount,
            viewedPage: 1
        })
    }

    setViewPage(page){
        this.setState({
            viewedPage: page
        })
    }

    render(){

        let mountModal = this.state.mountModal ? <MountModal addDeviceEntry={this.addDeviceEntry} modalHandler={this.showMountModal} show={this.state.mountModal} device={this.state.selectedDevices}/> : null;
        let detailModal = this.state.detailModal ? <DetailModal deviceDetails={this.state.deviceDetails} modalHandler={this.showDetailModal} show={this.state.detailModal}/> : null;

        return(
            <div className='listPage'>
                <Container>
                    <FormGroup className="deviceGroup leftAligned1">
                        <Button variant="outline-primary" onClick={this.showMountModal.bind(this)}><FontAwesomeIcon icon={faPlusCircle} /> Mount Device</Button>
                        <Button variant="outline-danger" onClick={this.removeDevices.bind(this)} ><FontAwesomeIcon icon={faMinusCircle} /> Unmount Devices</Button>
                    </FormGroup>
                    <FormGroup className="deviceGroup rightAligned1">
                        <Button variant="primary gradientBtn" onClick={this.refreshAllDeviceEntries.bind(this)}><FontAwesomeIcon icon={faSync} /> Refresh</Button>
                    </FormGroup>
                    <FormGroup className="searchGroup">
                        <Form.Control value={this.state.keywords} onChange={this.onEditSearch} placeholder="Search by keyword."/>
                    </FormGroup>

                    { mountModal }
                    { detailModal }

                    <div className="scrollWrapper">
                        <Table ref={this.table} striped hover size="sm">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th className="tableHeader" onClick={() => this.sort(0)}>Node ID</th>
                                    <th className="tableHeader" onClick={() => this.sort(1)}>IP address</th>
                                    <th className="tableHeader" onClick={() => this.sort(2)}>Status</th>
                                    <th className="tableHeader" onClick={() => this.sort(3)}>OS/Version</th>
                                    <th>Config</th>
                                </tr>
                            </thead>
                            <tbody>   
                                {this.repeat()}
                            </tbody>
                        </Table>
                    </div>
                </Container>
                <Container style={{marginTop: "5px"}}>
                    <Row>
                        <Col sm={2}>
                            <PageCount data={this.state.keywords === "" ? this.state.data : this.state.table}
                                       defaultPages={this.state.defaultPages}
                                       handler={this.setCountPages.bind(this)}/>
                        </Col>
                        <Col sm={8}/>
                        <Col sm={2}>
                            <PageSelect viewedPage={this.state.viewedPage} count={this.state.pagesCount} handler={this.setViewPage.bind(this)}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default List