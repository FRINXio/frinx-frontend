import React, { Component } from 'react';
import { Table, Container, Button, Form, FormGroup } from 'react-bootstrap'
import './List.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import MountModal from "./mountModal/MountModal";
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
            mountModal: false
        };
        library.add(faSync);
        this.table = React.createRef();
        this.onEditSearch = this.onEditSearch.bind(this);
        this.redirect = this.redirect.bind(this);
        this.addDevice = this.addDevice.bind(this);
        this.url_template = window.location.protocol + "//" + window.location.href.split('/')[2] + "/edit/"
    }

    componentWillMount() {
        this.search();
    }

    componentDidMount() {
        this.getAllDevices();
    }

    onEditSearch(event){
        this.setState({keywords: event.target.value}, () =>{
            this.search()
        })
    }

    async addDevice(device, topology) {
        console.log(device);
        let node_id, ip_address, status, os_version;

        if (topology === "cli") {
            node_id = device["node-id"];
            ip_address = device["cli-topology:host"];
            status = device["cli-topology:connection-status"];
            os_version = await http.get('/api/odl/get/conf/status/' + topology + "/" + node_id).then(res => {
                os_version = res["node"]["0"]["cli-topology:device-type"];
                os_version = os_version + " / " + res["node"]["0"]["cli-topology:device-version"];
                return os_version;
            })
        } else {
            node_id = device["node-id"];
            ip_address = device["netconf-node-topology:host"];
            status = device["netconf-node-topology:connection-status"];
            os_version = "netconf"
        }

        let entry = [node_id, ip_address, status, os_version];
        let mounted = false;
        let newData = this.state.data;

        for (let i = 0; i < newData.length; i++) {
            if ((newData[i].includes(ip_address) && newData[i].includes(os_version)) || (newData[i].includes(node_id) && newData[i].includes(os_version))) {
                mounted = true;
            }
        }

        if (!mounted) {
            newData.push(entry);
            this.setState({
                data: newData
            })
        }
    }

    onDeviceSelect(e){
        let checkboxID = e.target.id.split("-").pop();
        let row = document.getElementById(`row-${checkboxID}`);
        let node_id = row.querySelector("#node_id").innerText;
        let topology = row.querySelector("#topology").innerText;

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

    removeDevices() {
        this.state.selectedDevices.map(device => {
            if(device["topology"] === "netconf"){
                return http.delete('api/odl/unmount/topology-netconf/' + device["node_id"])
            } else {
                return http.delete('api/odl/unmount/cli/' + device["node_id"])
            }
        });
    }

    getAllDevices() {
        this.setState({data: [], mountModal: false});
        http.get('/api/odl/get/oper/all/status/cli').then(res => {
            let topologies = Object.keys(res);
            let topology = Object.keys(res[Object.keys(res)]);
            let topology_id = res[topologies][topology]["topology-id"];
            let nodes = res[topologies][topology]["node"];

            if (nodes) {
                nodes.map(device => {
                    return this.addDevice(device, topology_id)
                })
            }
        });

        http.get('/api/odl/get/oper/all/status/topology-netconf').then(res => {
            let topologies = Object.keys(res);
            let topology = Object.keys(res[Object.keys(res)]);
            let topology_id = res[topologies][topology]["topology-id"];
            let nodes = res[topologies][topology]["node"];

            if (nodes) {
                nodes.map(device => {
                    return this.addDevice(device, topology_id)
                })
            }
        })
    }

    search() {
        let toBeRendered = [];
        let toBeHighlited = [];
        let query = this.state.keywords.toUpperCase();
        if(query !== ""){
            const rows = this.state.data;
            for(let i = 0; i < rows.length; i++){
                for(let y = 0; y < rows[i].length; y++){
                    if(rows[i][y].toUpperCase().indexOf(query) !== -1){
                        toBeRendered.push(rows[i]);
                        toBeHighlited.push(y);
                        break
                    }
                }
            }
        } else {
            toBeRendered = this.state.data;
        }

        this.setState({
            table: toBeRendered,
            highlight: toBeHighlited
        })
    }

    calculateHighlight(i, y) {
        if(this.state.highlight[i] === y) {
            return 'hilit'
        } else {
            return ''
        }
    }

    redirect(where) {
        window.location.href = where;
    }

    showMountModal(){
        this.setState({
            mountModal: true,
        })
    }

    repeat(){
        let output = [];
        let highlight;
        let dataset;
        if(this.state.keywords === ""){
            dataset = this.state.data;
            highlight = false
        } else {
            dataset = this.state.table;
            highlight = true
        }
        for(let i = 0; i < dataset.length; i++){
            output.push(
                <tr key={`row-${i}`} id={`row-${i}`}>
                    <td className=''><Form.Check type="checkbox" onChange={(e) => this.onDeviceSelect(e)} id={`chb-${i}`}/></td>
                    <td id="node_id" className={highlight ? this.calculateHighlight(i, 0) : ''}>{dataset[i][0]}</td>
                    <td className={highlight ? this.calculateHighlight(i, 1) : ''}>{dataset[i][1]}</td>
                    <td className={highlight ? this.calculateHighlight(i, 2) : ''}>{dataset[i][2]}
                        &nbsp;&nbsp;<i className="fas fa-sync-alt fa-xs clickable"/></td>
                    <td id="topology" className={highlight ? this.calculateHighlight(i, 3) : ''}>{dataset[i][3]}</td>
                    <td><Button variant="outline-info" onClick={() => {
                        this.redirect(this.url_template + dataset[i][0])
                    }} size="sm"><i className="fas fa-cog"/></Button>
                    </td>
                </tr>)
        }
        return output
    }

    render(){
        return(
            <div className='listPage'>
                <Container>
                    <FormGroup className="deviceGroup leftAligned1">
                        <Button variant="outline-primary" onClick={this.showMountModal.bind(this)}><FontAwesomeIcon icon={faPlusCircle} /> Mount Device</Button>
                        <Button variant="outline-danger" onClick={this.removeDevices.bind(this)} ><FontAwesomeIcon icon={faMinusCircle} /> Unmount Devices</Button>
                    </FormGroup>
                    <FormGroup className="deviceGroup rightAligned1">
                        <Button variant="primary" onClick={this.getAllDevices.bind(this)}><FontAwesomeIcon icon={faSync} /> Refresh</Button>
                    </FormGroup>
                    <FormGroup className="searchGroup">
                        <Form.Control value={this.state.keywords} onChange={this.onEditSearch} placeholder="Search by keyword."/>
                    </FormGroup>

                    <MountModal addDevice={this.addDevice} show={this.state.mountModal}/>

                    <div className="scrollWrapper">
                        <Table ref={this.table} striped hover size="sm">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Node ID</th>
                                    <th>IP address</th>
                                    <th>Status</th>
                                    <th>OS/Version</th>
                                    <th>Config</th>
                                </tr>
                            </thead>
                            <tbody>   
                                {this.repeat()}
                            </tbody>
                        </Table>
                    </div>
                </Container>
            </div>
        )
    }
}

export default List