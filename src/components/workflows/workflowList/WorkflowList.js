import React, {Component} from 'react';
import {Accordion, Button, Card, Col, Container, Form, Row, Table} from 'react-bootstrap'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './WorkflowList.css'

const http = require('../../../server/HttpServerSide').HttpClient;

class WorkflowList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: "",
            labels: [],
            data: [],
            table: [],
            highlight: [],
            defaultPages: 20,
            pagesCount: 1,
            viewedPage: 1,
            activeRow: null
        };
        this.table = React.createRef();
        this.onEditSearch = this.onEditSearch.bind(this);
    }

    componentWillMount() {
        this.search();
    }

    componentDidMount() {
        http.get('/api/conductor/metadata/workflow').then(res => {
            console.log(res.result)
            this.setState({
                data: res.result || []
            })
        })
    }

    onEditSearch(event) {
        this.setState({keywords: event.target.value}, () =>{
            this.search()
        })
    }

    onLabelSearch(event) {
        this.setState({labels: event}, () =>{
            this.searchLabel()
        })
    }

    searchLabel() {
        let toBeRendered = [];
        const rows = this.state.keywords !== "" ? this.state.table : this.state.data;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i]["description"]) {
                let tags = rows[i]["description"].split("-").pop().replace(/\s/g, "").split(",");
                if (this.state.labels.every(elem => tags.indexOf(elem) > -1)) {
                    toBeRendered.push(rows[i]);
                }
            }
        }
        let pages = toBeRendered.length === 0 ? 0 : ~~(toBeRendered.length / this.state.defaultPages) + 1;
        this.setState({
            table: toBeRendered,
            pagesCount: pages
        });
        return null;
    }

    search() {
        let toBeRendered = [];
        let toBeHighlited = [];
        let query = this.state.keywords.toUpperCase();
        if (query !== "") {
            const rows = this.state.table.length > 0 ? this.state.table : this.state.data;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]["name"] && rows[i]["name"].toString().toUpperCase().indexOf(query) !== -1) {
                    toBeRendered.push(rows[i]);
                    toBeHighlited.push(i);
                }
            }
        } else {
            this.searchLabel();
            return;
        }
        let pages = toBeRendered.length === 0 ? 0 : ~~(toBeRendered.length / this.state.defaultPages) + 1;

        this.setState({
            table: toBeRendered,
            highlight: toBeHighlited,
            pagesCount: pages
        })
    }

    calculateHighlight(i) {
        if (this.state.highlight[i] !== null) {
            return 'hilit'
        }
        return ''
    }

    changeActiveRow(i) {
        this.getLabels();
        this.setState({
            activeRow: this.state.activeRow === i ? null : i
        });
    }

    repeat() {
        let output = [];
        let highlight;
        let dataset;
        let defaultPages = this.state.defaultPages;
        let viewedPage = this.state.viewedPage;
        if (this.state.keywords === "" && this.state.labels.length < 1) {
            dataset = this.state.data;
            highlight = false
        } else {
            dataset = this.state.table;
            highlight = true
        }
        for (let i = 0; i < dataset.length; i++) {
            if (i >= (viewedPage - 1) * defaultPages && i < viewedPage * defaultPages) {
                output.push(
                    <div className="wfRow" key={i}>
                        <Accordion.Toggle onClick={this.changeActiveRow.bind(this,i)} className="clickable" as={Card.Header} variant="link" eventKey={i}>
                            <p className={highlight ? this.calculateHighlight(i)  : ''}>{dataset[i]["name"]+" / "+dataset[i]["version"]}</p>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={i}>
                            <Card.Body style={{padding: "0px"}}>
                                <div style={{background: "linear-gradient(-120deg, rgb(0, 147, 255) 0%, rgb(0, 118, 203) 100%)", padding: "15px", marginBottom: "10px"}}>
                                    <Button variant="outline-light noshadow">Input</Button>
                                    <Button variant="outline-light noshadow">Definition</Button>
                                    <Button variant="outline-light noshadow">Diagram</Button>
                                </div>
                                <div className="accordBody">
                                <b>Tasks</b><br/>
                                    <p>{JSON.stringify(dataset[i]["tasks"].map(task => {return task.name}))}</p>
                                <b>{dataset[i]["inputParameters"] ? "Input Parameters" : null}</b><br/>
                                    <p>{JSON.stringify(dataset[i]["inputParameters"])}</p>
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </div>
                )
            }
        }
        return output
    }

    setPages(){
        let output = [];
        let viewedPage = this.state.viewedPage;
        let pagesCount = this.state.pagesCount;
        output.push(
            <i key={`page-left`} className={viewedPage !== 1 && pagesCount !== 0 ? "pages fas fa-angle-left" : " fas fa-angle-left"}
               onClick={(e) => {
                   if(viewedPage !== 1 && pagesCount !== 0)
                       this.setState({
                           viewedPage : viewedPage - 1
                       })
               }}
            />
        );
        for(let i = 1; i <= pagesCount; i++){
            if( i >= viewedPage - 2 && i <= viewedPage + 2) {
                output.push(
                    <i key={`page-${i}`} className={viewedPage === i ? "" : "pages"}
                       onClick={(e) =>
                           this.setState({
                               viewedPage: i
                           })
                       }
                    > {i} </i>
                )
            }
        }
        output.push(
            <i key={`page-right`} className={viewedPage !== pagesCount && pagesCount !== 0 ? "pages fas fa-angle-right" : " fas fa-angle-right"}
               onClick={(e) => {
                   if(viewedPage !== pagesCount && pagesCount !== 0)
                       this.setState({
                           viewedPage : viewedPage + 1
                       })
               }}
            />
        );
        return output;
    }

    getLabels() {
        let labelsArr = [];
        this.state.data.map(wf => {
            let str = wf["description"].substring(wf["description"].indexOf("-") + 1);
            if (str === wf["description"]) {
                str = null;
            }
            if (str) {
                str = str.replace(/\s/g, "");
                labelsArr = labelsArr.concat(str.split(","));
            }
            return null;
        });
        return [...new Set([].concat(...labelsArr))];
    }

    render(){
        return(
            <div className='listPage'>
                <Container style={{textAlign: "left"}}>
                    <h1 style={{margin: "20px"}}><i style={{color: 'grey'}} className="fas fa-cogs"/>&nbsp;&nbsp;Workflows</h1><hr/>
                    <Row>
                        <Col>
                            <Typeahead
                                selected={this.state.labels}
                                onChange={this.onLabelSearch.bind(this)} clearButton
                                labelKey="name" multiple options={this.getLabels()}
                                placeholder="Search by label."/>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Control value={this.state.keywords} onChange={this.onEditSearch}
                                              placeholder="Search by keyword."/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="scrollWrapper">
                        <Table ref={this.table}>
                            <thead>
                                <tr><th>Name/Version</th></tr>
                            </thead>
                            <tbody>
                                <Accordion activeKey={this.state.activeRow}>
                                    {this.repeat()}
                                </Accordion>
                            </tbody>
                        </Table>
                    </div>
                </Container>
                <Container>
                    <Row>
                        <Col sm={2} style={{textAlign: "left"}}>
                            <i className={this.state.defaultPages === 20 ? "": "pages"}
                               onClick={(e) => {
                                   let data = this.state.keywords === "" ? this.state.data : this.state.table;
                                   this.setState({
                                       defaultPages : 20,
                                       pagesCount: data.length === 0 ? 0 : ~~(this.state.data.length / 20) + 1,
                                       viewedPage: 1

                                   })}}
                            >20 </i>
                            <i className={this.state.defaultPages === 50 ? "": "pages"}
                               onClick={(e) => {
                                   let data = this.state.keywords === "" ? this.state.data : this.state.table;
                                   this.setState({
                                       defaultPages : 50,
                                       pagesCount: data.length === 0 ? 0 : ~~(this.state.data.length / 50) + 1,
                                       viewedPage: 1
                                   })}}
                            >50 </i>
                            <i className={this.state.defaultPages === 100 ? "": "pages"}
                               onClick={(e) => {
                                   let data = this.state.keywords === "" ? this.state.data : this.state.table;
                                   this.setState({
                                       defaultPages : 100,
                                       pagesCount: data.length === 0 ? 0 : ~~(this.state.data.length / 100) + 1,
                                       viewedPage: 1 })}}
                            >100 </i>
                        </Col>
                        <Col sm={8}>
                        </Col>
                        <Col sm={2} style={{textAlign: "right"}}>
                            {this.setPages()}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default WorkflowList