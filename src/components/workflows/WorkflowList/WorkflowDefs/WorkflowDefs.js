import React, {Component} from 'react';
import {Accordion, Button, Card, Col, Container, Form, Row, Table} from 'react-bootstrap'
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './WorkflowDefs.css'
import DefinitionModal from "./DefinitonModal/DefinitionModal";
import InputModal from "./InputModal/InputModal";
import DiagramModal from "./DiagramModal/DiagramModal";
import PageCount from "../../../common/PageCount";
import PageSelect from "../../../common/PageSelect";

const http = require('../../../../server/HttpServerSide').HttpClient;

class WorkflowDefs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: "",
            labels: [],
            data: [],
            table: [],
            activeRow: null,
            activeWf: null,
            defModal: false,
            diagramModal: false,
            defaultPages: 20,
            pagesCount: 1,
            viewedPage: 1
        };
        this.table = React.createRef();
        this.onEditSearch = this.onEditSearch.bind(this);
    }

    componentWillMount() {
        this.search();
    }

    componentDidMount() {
        http.get('/api/conductor/metadata/workflow').then(res => {
            let size = ~~(res.result.length / this.state.defaultPages);
            this.setState({
                data: res.result || [],
                pagesCount: res.result.length % this.state.defaultPages ? ++size : size
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
        this.setState({
            table: toBeRendered,
        });
        return null;
    }

    search() {
        let toBeRendered = [];
        let query = this.state.keywords.toUpperCase();
        if (query !== "") {
            const rows = this.state.table.length > 0 ? this.state.table : this.state.data;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]["name"] && rows[i]["name"].toString().toUpperCase().indexOf(query) !== -1) {
                    toBeRendered.push(rows[i]);
                }
            }
        } else {
            this.searchLabel();
            return;
        }
        this.setState({
            table: toBeRendered,
        })
    }

    changeActiveRow(i) {
        this.getLabels();
        this.setState({
            activeRow: this.state.activeRow === i ? null : i,
            activeWf: document.querySelector(`#wf${i}`).innerText
        });
    }

    updateFavourite(data) {
        data.description = data.description.includes(", FAVOURITE")
            ? data.description.replace(", FAVOURITE","")
            : data.description += ", FAVOURITE";
        http.put('/api/conductor/metadata/', [data]).then( response => {
            http.get('/api/conductor/metadata/workflow').then(res => {
                this.setState({
                    data: res.result || [],
                })
            })
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

    repeat() {
        let output = [];
        let dataset;
        let defaultPages = this.state.defaultPages;
        let viewedPage = this.state.viewedPage;
        if (this.state.keywords === "" && this.state.labels.length < 1) {
            dataset = this.state.data;
        } else {
            dataset = this.state.table;
        }
        for (let i = 0; i < dataset.length; i++) {
            if (i >= (viewedPage - 1) * defaultPages && i < viewedPage * defaultPages) {
                output.push(
                    <div className="wfRow" key={i}>
                        <Accordion.Toggle id={`wf${i}`} onClick={this.changeActiveRow.bind(this, i)}
                                          className="clickable" as={Card.Header} variant="link" eventKey={i}>
                            {dataset[i]["name"] + " / " + dataset[i]["version"]}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={i}>
                            <Card.Body style={{padding: "0px"}}>
                                <div style={{
                                    background: "linear-gradient(-120deg, rgb(0, 147, 255) 0%, rgb(0, 118, 203) 100%)",
                                    padding: "15px",
                                    marginBottom: "10px"
                                }}>
                                    <Button variant="outline-light noshadow"
                                            onClick={this.showInputModal.bind(this)}>Input</Button>
                                    <Button variant="outline-light noshadow"
                                            onClick={this.showDefinitionModal.bind(this)}>Definition</Button>
                                    <Button variant="outline-light noshadow"
                                            onClick={this.showDiagramModal.bind(this)}>Diagram</Button>
                                    <Button variant="outline-light noshadow"
                                            onClick={this.updateFavourite.bind(this, dataset[i])}>
                                        <i className={dataset[i]["description"].includes("FAVOURITE") ? 'fa fa-star' : 'far fa-star'}
                                           style={{cursor: 'pointer'}}
                                        />
                                    </Button>
                                </div>
                                <div className="accordBody">
                                    <b>{dataset[i]["description"] ? "Description" : null}</b><br/>
                                    <p>{JSON.stringify(dataset[i]["description"] + 1).split("-")[0].substr(1)}</p>
                                    <b>Tasks</b><br/>
                                    <p>{JSON.stringify(dataset[i]["tasks"].map(task => {
                                        return task.name
                                    }))}</p>
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </div>
                )
            }
        }
        return output
    }

    getLabels() {
        let labelsArr = [];
        if (this.state.data.length) {
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
        }
        return [...new Set([].concat(...labelsArr))];
    }

    showDefinitionModal() {
        this.setState({
            defModal: !this.state.defModal
        })
    }

    showInputModal() {
        this.setState({
            inputModal: !this.state.inputModal
        })
    }

    showDiagramModal() {
        this.setState({
            diagramModal: !this.state.diagramModal
        })
    }


    render(){

        let definitionModal = this.state.defModal ?
            <DefinitionModal wf={this.state.activeWf} modalHandler={this.showDefinitionModal.bind(this)}
                             show={this.state.defModal}/> : null;

        let inputModal = this.state.inputModal ?
            <InputModal wf={this.state.activeWf} modalHandler={this.showInputModal.bind(this)}
                        show={this.state.inputModal}/> : null;

        let diagramModal = this.state.diagramModal ?
            <DiagramModal wf={this.state.activeWf} modalHandler={this.showDiagramModal.bind(this)}
                          show={this.state.diagramModal}/> : null;

        return (
         <div>
             {definitionModal}
             {inputModal}
             {diagramModal}
             <Row>
                 <Col>
                     <Typeahead
                         id="typeaheadDefs"
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
             <div className="scrollWrapper" style={{maxHeight: "650px"}}>
                 <Table ref={this.table}>
                     <thead>
                     <tr>
                         <th>Name/Version</th>
                     </tr>
                     </thead>
                     <tbody>
                         <Accordion activeKey={this.state.activeRow}>
                             {this.repeat()}
                         </Accordion>
                     </tbody>
                 </Table>
             </div>
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

export default WorkflowDefs
