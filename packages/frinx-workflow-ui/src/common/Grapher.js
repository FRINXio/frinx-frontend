// @flow
import Clipboard from 'clipboard';
import React, { Component } from 'react';
import TaskModal from './TaskModal';
import d3 from 'd3';
import dagreD3 from 'dagre-d3';
import { Box, Flex } from '@chakra-ui/react';
import type { Task } from './flowtypes';

new Clipboard('.btn');

type SubGraph = {
  n: [],
  vx: {},
  layout: {},
};

type Props = {
  innerGraph?: [],
  layout: {},
  edges: [],
  vertices: {},
  defs?: {},
  def?: {},
};

type StateType = {
  innerGraph: [],
  subGraph: SubGraph,
  showSideBar: boolean,
  selectedTask: Task,
  showSubGraph: boolean,
  subGraphId: string,
};

type Parent = {
  insert: (
    shape: string,
    st: string,
  ) => {
    attr: (t: string, sp: string) => {},
  },
};

class Grapher extends Component<Props, StateType> {
  grapher: any;
  setSvgRef: (param: {} | null) => {} | null;
  svgElem: {} | null;

  constructor(props: Props) {
    super(props);

    this.state = {};
    this.state.selectedTask = {};
    this.state.logs = {};
    this.grapher = new dagreD3.render();

    this.setSvgRef = (elem) => (this.svgElem = elem);

    const starPoints = function (outerRadius, innerRadius) {
      let results = '';
      const angle = Math.PI / 8;
      for (let i = 0; i < 2 * 8; i++) {
        // Use outer or inner radius depending on what iteration we are in.
        const r = (i & 1) === 0 ? outerRadius : innerRadius;
        const currX = Math.cos(i * angle) * r;
        const currY = Math.sin(i * angle) * r;
        if (i === 0) {
          results = currX + ',' + currY;
        } else {
          results += ', ' + currX + ',' + currY;
        }
      }
      return results;
    };

    this.grapher.shapes().house = function (parent, bbox, node) {
      const w = bbox.width,
        h = bbox.height,
        points = [
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: -h },
          { x: w / 2, y: (-h * 3) / 2 },
          { x: 0, y: -h },
        ];
      const shapeSvg = parent
        .insert('polygon', ':first-child')
        .attr(
          'points',
          points
            .map(function (d) {
              return d.x + ',' + d.y;
            })
            .join(' '),
        )
        .attr('transform', 'translate(' + -w / 2 + ',' + (h * 3) / 4 + ')');

      node.intersect = function (point) {
        return dagreD3.intersect.polygon(node, points, point);
      };

      return shapeSvg;
    };

    this.grapher.shapes().star = function (parent, bbox, node) {
      const w = bbox.width,
        h = bbox.height,
        points = [
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: -h },
          { x: w / 2, y: (-h * 3) / 2 },
          { x: 0, y: -h },
        ];
      const shapeSvg = parent.insert('polygon', ':first-child').attr('points', starPoints(w, h));
      node.intersect = function (point) {
        return dagreD3.intersect.polygon(node, points, point);
      };

      return shapeSvg;
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      innerGraph: nextProps.innerGraph,
    });
  }

  getSubGraph() {
    const subg = this.state.subGraph;
    if (subg == null) {
      return '';
    }
    return <Grapher edges={subg.n} vertices={subg.vx} layout={subg.layout} />;
  }

  render() {
    const { layout, edges, vertices } = this.props;

    const g = new dagreD3.graphlib.Graph().setGraph({ rankdir: layout });

    for (const vk in vertices) {
      const v = vertices[vk];
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
        style: v.style ? v.style : 'fill: #fff; stroke: #ccc' + ';cursor: pointer;',
        labelStyle: v.labelStyle + '; font-weight:normal; font-size: 11px; cursor: pointer;',
      });
    }

    edges.forEach((e) => {
      g.setEdge(e.from, e.to, {
        label: e.label,
        lineInterpolate: 'basis',
        style: e.style,
      });
    });

    g.nodes().forEach(function (v) {
      const node = g.node(v);
      if (node == null) {
        console.log('NO node found ' + v);
      }
      node.rx = node.ry = 5;
    });

    const svg = d3.select(this.svgElem);
    const inner = svg.select('g');
    inner.attr('transform', 'translate(20,20)');
    this.grapher(inner, g);

    const w = g.graph().width + 200;
    const h = g.graph().height + 50;

    svg.attr('width', w + 'px').attr('height', h + 'px');

    const innerGraph = this.state.innerGraph || [];
    const p = this;

    const hideProps = function () {
      p.setState({ showSideBar: false });
    };

    inner.selectAll('g.node').on('click', function (v) {
      if (innerGraph[v] != null) {
        const data = vertices[v].data;

        const n = innerGraph[v].edges;
        const vx = innerGraph[v].vertices;
        const subg = { n: n, vx: vx, layout: layout };

        p.setState({
          selectedTask: data.task,
          showSubGraph: true,
          showSideBar: true,
          subGraph: subg,
          subGraphId: innerGraph[v].id,
        });
      } else if (vertices[v].tooltip != null) {
        const data = vertices[v].data;

        if (data.taskType === 'final' || data.taskType === 'start') return;

        p.setState({
          selectedTask: data.task,
          showSideBar: true,
          subGraph: null,
          showSubGraph: false,
        });
      }
    });

    const showNodeDetails = () => (
      <TaskModal task={this.state.selectedTask} show={this.state.showSideBar} handle={hideProps} />
    );

    return (
      <Flex>
        <div>{showNodeDetails()}</div>
        <Box>
          <div>
            <svg ref={this.setSvgRef}>
              <g transform="translate(20,20)" />
            </svg>
          </div>
        </Box>

        {this.props.def ? null : (
          <Box>
            <div>{/*{this.getSubGraph()}*/}</div>
          </Box>
        )}
      </Flex>
    );
  }
}

export default Grapher;
