import React, {Component} from 'react';
import {Col, Container, Form, FormGroup, Row, Table} from 'react-bootstrap'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faSync} from '@fortawesome/free-solid-svg-icons'
import './TaskList.css'
import PageSelect from "../../common/PageSelect";
import PageCount from "../../common/PageCount";
const http = require('../../../server/HttpServerSide').HttpClient;

class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: "",
            data: [],
            table: [],
            highlight: [],
            defaultPages: 20,
            pagesCount: 1,
            viewedPage: 1
        };
        library.add(faSync);
        this.table = React.createRef();
        this.onEditSearch = this.onEditSearch.bind(this);
    }

    componentWillMount() {
        this.search();
    }

    componentDidMount() {
        http.get('/api/conductor/metadata/taskdef').then(res => {
            let size = ~~(res.result.length / this.state.defaultPages);
            this.setState({
                data: res.result || [],
                pagesCount: res.result ? res.result.length % this.state.defaultPages ? ++size : size : 0
            })
        })
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
                for(let y = 1; y < Object.values(rows[i]).length; y++){
                    if(Object.values(rows[i])[y] && Object.values(rows[i])[y].toString().toUpperCase().indexOf(query) !== -1){
                        toBeRendered.push(rows[i]);
                        toBeHighlited.push(Object.keys(rows[i])[y]);
                        break
                    }
                }
            }
        } else {
            toBeRendered = this.state.data;
        }
        let size = ~~(toBeRendered.length / this.state.defaultPages);
        let pages = toBeRendered.length ? toBeRendered.length % this.state.defaultPages? ++size : size : 0;

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

    repeat() {
        let output = [];
        let highlight;
        let dataset;
        let defaultPages = this.state.defaultPages;
        let viewedPage = this.state.viewedPage;
        if (this.state.keywords === "") {
            dataset = this.state.data;
            highlight = false
        } else {
            dataset = this.state.table;
            highlight = true
        }
        for (let i = 0; i < dataset.length; i++) {
            if (i >= (viewedPage - 1) * defaultPages && i < viewedPage * defaultPages) {
                output.push(
                    <tr key={`row-${i}`} id={`row-${i}`}>
                        <td className={highlight ? this.calculateHighlight(i, "name") + ' leftAligned' : 'leftAligned'}>{dataset[i]["name"]}</td>
                        <td className={highlight ? this.calculateHighlight(i, "timeoutPolicy") : ''}>{dataset[i]["timeoutPolicy"]}</td>
                        <td className={highlight ? this.calculateHighlight(i, "timeoutSeconds") : ''}>{dataset[i]["timeoutSeconds"]}</td>
                        <td className={highlight ? this.calculateHighlight(i, "responseTimeoutSeconds") : ''}>{dataset[i]["responseTimeoutSeconds"]}</td>
                        <td className={highlight ? this.calculateHighlight(i, "retryCount") : ''}>{dataset[i]["retryCount"]}</td>
                        <td className={highlight ? this.calculateHighlight(i, "rateLimitPerFrequency") : ''}>{dataset[i]["rateLimitPerFrequency"]}</td>
                        <td className={highlight ? this.calculateHighlight(i, "rateLimitFrequencyInSeconds") : ''}>{dataset[i]["rateLimitFrequencyInSeconds"]}</td>
                        <td className={highlight ? this.calculateHighlight(i, "retryLogic") : ''}>{dataset[i]["retryLogic"]}</td>
                    </tr>)
            }
        }
        return output
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
        return(
            <div className='listPage'>
                <Container>
                    <h1 style={{margin: "20px"}} className="leftAligned"><i style={{color: 'grey'}} className="fas fa-tasks"/>&nbsp;&nbsp;Task Definitions</h1>
                    <FormGroup className="searchGroup">
                        <Form.Control value={this.state.keywords} onChange={this.onEditSearch} placeholder="Search by keyword."/>
                    </FormGroup>
                    <div className="scrollWrapper">
                        <Table ref={this.table} striped hover size="sm">
                            <thead>
                            <tr>
                                <th>Name/Version</th>
                                <th>Timeout Policy</th>
                                <th>Timeout Seconds</th>
                                <th>Response Timeout</th>
                                <th>Retry Count</th>
                                <th>Rate Limit Amount</th>
                                <th>Rate Limit Frequency Seconds</th>
                                <th>Retry Logic</th>
                            </tr>
                            </thead>
                            <tbody className="tasktable">
                            {this.repeat()}
                            </tbody>
                        </Table>
                    </div>
                </Container>
                <Container style={{marginTop: "5px"}}>
                    <Row>
                        <Col sm={2}>
                            <PageCount dataSize={this.state.keywords === "" ? this.state.data.length : this.state.table.length}
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

export default TaskList