import React, {Component} from 'react';
import dagreD3 from 'dagre-d3';
import d3 from 'd3';
import {Tabs, Tab, Modal, Row, Col, Container} from 'react-bootstrap';
import Clipboard from 'clipboard';
import UnescapeButton from "../uniconfig/deviceView/consoleModal/UnescapeButton";
import Highlight from "react-highlight.js";

new Clipboard('.btn');

class Grapher extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.state.selectedTask = {};
        this.state.logs = {};
        this.grapher = new dagreD3.render();

        this.setSvgRef = elem => this.svgElem = elem;

        let starPoints = function (outerRadius, innerRadius) {
            let results = "";
            let angle = Math.PI
                / 8;
            for (let i = 0; i < 2 * 8; i++) {
                // Use outer or inner radius depending on what iteration we are in.
                let r = (i & 1) === 0 ? outerRadius : innerRadius;
                let currX = Math.cos(i * angle) * r;
                let currY = Math.sin(i * angle) * r;
                if (i === 0) {
                    results = currX + "," + currY;
                } else {
                    results += ", " + currX + "," + currY;
                }
            }
            return results;
        };

        this.grapher.shapes().house = function (parent, bbox, node) {
            let w = bbox.width,
                h = bbox.height,
                points = [
                    {x: 0, y: 0},
                    {x: w, y: 0},
                    {x: w, y: -h},
                    {x: w / 2, y: -h * 3 / 2},
                    {x: 0, y: -h}
                ];
            let shapeSvg = parent.insert("polygon", ":first-child")
                .attr("points", points.map(function (d) {
                    return d.x + "," + d.y;
                }).join(" "))
                .attr("transform", "translate(" + (-w / 2) + "," + (h * 3 / 4) + ")");

            node.intersect = function (point) {
                return dagreD3.intersect.polygon(node, points, point);
            };

            return shapeSvg;
        };

        this.grapher.shapes().star = function (parent, bbox, node) {
            let w = bbox.width,
                h = bbox.height,
                points = [
                    {x: 0, y: 0},
                    {x: w, y: 0},
                    {x: w, y: -h},
                    {x: w / 2, y: -h * 3 / 2},
                    {x: 0, y: -h}
                ];
            let shapeSvg = parent.insert("polygon", ":first-child").attr("points", starPoints(w, h));
            node.intersect = function (point) {
                return dagreD3.intersect.polygon(node, points, point);
            };

            return shapeSvg;
        };
    }

    componentDidMount() {
        this.forceUpdate();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            innerGraph: nextProps.innerGraph
        })
    };

    getSubGraph() {
        let subg = this.state.subGraph;
        if (subg == null) {
            return '';
        }
        return <Grapher edges={subg.n} vertices={subg.vx} layout={subg.layout}/>;
    }

    render() {
        const {layout, edges, vertices} = this.props;

        let g = new dagreD3.graphlib.Graph().setGraph({rankdir: layout});

        for (let vk in vertices) {
            let v = vertices[vk];
            let l = v.name;
            if (!v.system) {
                l = v.name + '\n \n(' + v.ref + ')';
            } else {
                l = v.ref;
            }

            g.setNode(v.ref, {
                label: l,
                shape: v.shape,
                // eslint-disable-next-line no-useless-concat
                style: v.style ? v.style : ("fill: #fff; stroke: #ccc") + ';cursor: pointer;',
                labelStyle: v.labelStyle + '; font-weight:normal; font-size: 11px; cursor: pointer;'
            });
        }

        edges.forEach(e => {
            g.setEdge(e.from, e.to, {label: e.label, lineInterpolate: 'basis', style: e.style});
        });

        g.nodes().forEach(function (v) {
            var node = g.node(v);
            if (node == null) {
                console.log('NO node found ' + v);
            }
            node.rx = node.ry = 5;
        });

        let svg = d3.select(this.svgElem);
        let inner = svg.select("g");
        inner.attr("transform", "translate(20,20)");
        this.grapher(inner, g);

        let w = g.graph().width + 200;
        let h = g.graph().height + 50;

        svg.attr("width", w + "px").attr("height", h + "px");


        let innerGraph = this.state.innerGraph || [];
        let p = this;

        let showSubGraphDetails = function () {
            let id = p.state.subGraphId;
            window.open('#/workflow/id/' + id, '_new');
        };

        let hidesub = function () {
            p.setState({showSubGraph: false});
        };

        let hideProps = function () {
            p.setState({showSideBar: false});
        };

        inner.selectAll("g.node")
            .on("click", function (v) {
                if (innerGraph[v] != null) {
                    let data = vertices[v].data;

                    let n = innerGraph[v].edges;
                    let vx = innerGraph[v].vertices;
                    let subg = {n: n, vx: vx, layout: layout};

                    p.setState({
                        selectedTask: data.task,
                        showSubGraph: true,
                        showSideBar: true,
                        subGraph: subg,
                        subGraphId: innerGraph[v].id
                    });

                } else if (vertices[v].tooltip != null) {
                    let data = vertices[v].data;

                    p.setState({selectedTask: data.task, showSideBar: true, subGraph: null, showSubGraph: false});
                }
            });


        let showNodeDetails = () => (
            <Modal size='lg' centered scrollable show={this.state.showSideBar} onHide={hideProps}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {this.state.selectedTask.taskType} ({this.state.selectedTask.status})
                    <div style={{
                        color: '#ff0000',
                        display: this.state.selectedTask.status === 'FAILED' ? '' : 'none'
                    }}>{this.state.selectedTask.reasonForIncompletion}</div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Summary">
                        <Container>
                            <Row style={{marginTop: "20px", marginBottom: "20px"}}>
                                <Col sm={8}>
                                    <b>Task Ref. Name:&nbsp;&nbsp;</b>
                                    {this.state.selectedTask.referenceTaskName}
                                </Col>
                                <Col>
                                    <b>Callback After:&nbsp;&nbsp;</b>
                                    {this.state.selectedTask.callbackAfterSeconds ? this.state.selectedTask.callbackAfterSeconds : 0} (second)
                                    <br/><b>Poll Count:&nbsp;&nbsp;</b>
                                    {this.state.selectedTask.pollCount}
                                </Col>
                            </Row>
                            <hr/>
                            <Row style={{marginBottom: "15px"}}>
                                <b>Input<i title="copy to clipboard" className="btn fa fa-clipboard"
                                            data-clipboard-target="#t_input"/></b>
                                <UnescapeButton size="sm" target="t_input"/>
                            </Row>
                            <Row>
                                <code>
                                        <pre style={{width: "770px"}} id="t_input">
                                             <Highlight language="json">
                                            {JSON.stringify(this.state.selectedTask.inputData, null, 3)}
                                             </Highlight>
                                        </pre>
                                </code>
                            </Row>
                            <Row style={{marginBottom: "15px"}}>
                                <b>Output<i title="copy to clipboard" className="btn fa fa-clipboard"
                                             data-clipboard-target="#t_output"/></b>
                                <UnescapeButton size="sm" target="t_output"/>
                            </Row>
                            <Row>
                                <code>
                                        <pre style={{width: "770px"}} id="t_output">
                                             <Highlight language="json">
                                                {JSON.stringify(this.state.selectedTask.outputData, null, 3)}
                                             </Highlight>
                                        </pre>
                                </code>
                            </Row>
                        </Container>
                    </Tab>
                    <Tab eventKey={2} title="JSON"><br/>
                        <b>JSON<i title="copy to clipboard" className="btn fa fa-clipboard"
                                  data-clipboard-target="#t_json"/></b>
                           <UnescapeButton size="sm" target="t_json"/>

                        <code>
                            <pre style={{maxHeight: "500px", marginTop: "20px"}} id="t_json">
                                <Highlight language="json">
                                    {JSON.stringify(this.state.selectedTask, null, 3)}
                                </Highlight>
                            </pre>
                        </code>
                    </Tab>
                    <Tab eventKey={3} title="Logs"><br/>
                        <b>Logs<i title="copy to clipboard" className="btn fa fa-clipboard"
                                  data-clipboard-target="#t_logs"/></b>
                           <UnescapeButton size="sm" target="t_logs"/>
                        <code>
                             <pre style={{maxHeight: "500px", marginTop: "20px"}} id="t_logs">
                                 <Highlight language="json">
                                    {JSON.stringify(this.state.selectedTask.logs, null, 3)}
                                 </Highlight>
                             </pre>
                        </code>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
        );

        return (
            <Row>
                <div>
                    {showNodeDetails()}
                </div>
                <Col>
                    <div style={ this.props.def ? null : {marginLeft: "auto", marginRight: "auto", width: "30%"}}>
                        <svg ref={this.setSvgRef}>
                            <g transform="translate(20,20)"/>
                        </svg>
                    </div>
                </Col>

                {this.props.def ? null :
                    <Col>
                        <div style={this.props.def ? null : {
                            margin: "auto",
                            display: this.state.showSubGraph ? '' : 'none'
                        }}>
                            {this.getSubGraph()}
                        </div>
                    </Col>
                }
            </Row>
        );
    }
}

export default Grapher;
