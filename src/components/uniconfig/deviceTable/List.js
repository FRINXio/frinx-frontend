import React, { Component } from 'react';
import { Table, Container, Button, Form, FormGroup } from 'react-bootstrap'
import './List.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: "",
            data: [
                ["1", "205.206.198.246", "Active", "Debian", "AAAAA"],
                ["2", "19.109.166.144", "Active", "Debian", "BBBBB"],
                ["3", "169.82.108.167", "Active", "Debian", "CCCCC"],
                ["4", "88.250.45.87", "Active", "Debian", "DDDDD"],
                ["5", "90.201.129.182", "Active", "Debian", "EEEEE"],
                ["6", "7.195.255.207", "Active", "Debian", "FFFFF"],
                ["7", "143.233.31.217", "Active", "Debian", "GGGGG"],
                ["8", "147.255.159.169", "Active", "Debian", "HHHHH"],
                ["9", "82.238.134.189", "Active", "FreeBSD", "IIIII"],
                ["10", "106.246.233.249", "Active", "FreeBSD", "JJJJJ"],
                ["11", "163.96.42.127", "Active", "FreeBSD", "KKKKK"],
                ["12", "5.33.224.128", "Active", "FreeBSD", "LLLLL"],
                ["13", "254.40.106.77", "Active", "FreeBSD", "MMMMM"],
                ["14", "137.70.62.219", "Active", "FreeBSD", "NNNNN"],
                ["15", "134.103.47.57", "Active", "FreeBSD", "OOOOO"],
                ["16", "82.245.12.43", "Active", "CentOS", "PPPPP"],
                ["17", "71.112.249.226", "Active", "CentOS", "QQQQQ"],
                ["18", "104.211.22.220", "Disabled", "CentOS", "RRRRR"],
                ["19", "203.79.246.234", "Disabled", "CentOS", "SSSSS"],
                ["20", "199.134.150.131", "Disabled", "CentOS", "TTTTT"],
                ["21", "29.212.91.0", "Active", "CentOS", "UUUUU"],
                ["22", "122.237.249.208", "Active", "CentOS", "VVVVV"],
                ["23", "236.25.125.122", "Disabled", "CentOS", "WWWWW"],
                ["24", "209.21.69.204", "Active", "CentOS", "XXXXX"],
                ["25", "5.146.88.200", "Active", "CentOS", "YYYYY"],
                ["26", "71.120.204.15", "Active", "CentOS", "ZZZZZ"],
            ],
            table: [],
            highlight: []
        }
        library.add(faSync);
        this.table = React.createRef();
        this.onEditSearch = this.onEditSearch.bind(this)
        this.redirect = this.redirect.bind(this)
        this.url_template = window.location.protocol + "//" + window.location.href.split('/')[2] + "/edit/"
    }

    componentWillMount() {
        this.search()
    }

    onEditSearch(event){
        this.setState({keywords: event.target.value}, () =>{
            this.search()
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
                <tr className="clickable" onClick={() => {this.redirect(this.url_template + dataset[i][0])}}>
                    <td className={highlight ? this.calculateHighlight(i, 0) : ''}>{dataset[i][0]}</td>
                    <td className={highlight ? this.calculateHighlight(i, 1) : ''}>{dataset[i][1]}</td>
                    <td className={highlight ? this.calculateHighlight(i, 2) : ''}>{dataset[i][2]}</td>
                    <td className={highlight ? this.calculateHighlight(i, 3) : ''}>{dataset[i][3]}</td>
                    <td className={highlight ? this.calculateHighlight(i, 4) : ''}>{dataset[i][4]}</td>
                </tr>)
        }
        return output
    }

    render(){
        return(
            <div className='listPage'>
                <Container>
                    <FormGroup className="deviceGroup leftAligned1">
                        <Button variant="outline-primary"><FontAwesomeIcon icon={faPlusCircle} /> Mount CLI Device</Button>
                        <Button variant="outline-danger"><FontAwesomeIcon icon={faMinusCircle} /> Remove CLI Device</Button>
                    </FormGroup>
                    <FormGroup className="deviceGroup rightAligned1">
                        <Button variant="primary"><FontAwesomeIcon icon={faSync} /> Refresh</Button>
                    </FormGroup>
                    <FormGroup className="searchGroup">
                        <Form.Control value={this.state.keywords} onChange={this.onEditSearch} placeholder="Search by keyword."/>
                    </FormGroup>
                    <div className="scrollWrapper">
                        <Table ref={this.table} striped hover size="sm">
                            <thead>
                                <tr>
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