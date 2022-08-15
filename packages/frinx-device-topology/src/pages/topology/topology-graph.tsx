// @ts-nocheck
import { useTheme } from '@emotion/react';
import * as d3 from 'd3';
import React, { createRef, FunctionComponent, useEffect } from 'react';

const width = 1248;
const height = 600;
const linkStrokeOpacity = 0.6;
const linkStrokeLinecap = 'round';
const nodeStrokeWidth = 1.5;
const nodeStrokeOpacity = 1;

type Node = {
  id: string;
  name: string;
};
type Edge = {
  id: string;
  source: Node['id'];
  target: Node['id'];
};

type Props = {
  data: {
    readonly nodes: Node[];
    readonly edges: Edge[];
  };
};

const TopologyGraph: FunctionComponent<Props> = ({ data }) => {
  const { nodes, edges } = data;
  const svgRef = createRef<SVGSVGElement>();
  const theme = useTheme();

  useEffect(() => {
    const forceNode = d3.forceManyBody().strength(-500);
    const forceLink = d3.forceLink([...edges]).id(({ index: i }) => nodes[i ?? 0].name);

    const simulation: d3.Simulation<Node, Edge> = d3
      .forceSimulation(nodes)
      .force('link', forceLink)
      .force('charge', forceNode)
      .force('center', d3.forceCenter());

    // d3.select('body').selectAll('.tooltip').remove();
    // const div = d3
    //   .select('body')
    //   .append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0)
    //   .style('position', 'absolute')
    //   .style('background', '#222')
    //   .style('color', 'white')
    //   .style('padding', '10px');

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements
    const svg = svgEl
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    const link = svg
      .append('g')
      .attr('stroke-opacity', linkStrokeOpacity)
      .attr('stroke-linecap', linkStrokeLinecap)
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke-width', 1)
      .attr('stroke', 'black');

    const node = svg.append('g').selectAll('g').data(nodes).join('g').attr('transform-origin', '50% 50%');
    // .on('mouseover', (event, n) => {
    //   div.transition().duration(200).style('opacity', 1);
    //   div.html(`<span>${n.name}</span>`).style('left', `${event.pageX}px`).style('top', `${event.pageY}px`);
    // })
    // .on('mouseout', () => {
    //   div.style('left', 0);
    //   div.style('right', 0);
    //   div.transition().duration(200).style('opacity', 0);
    // });

    node
      .append('circle')
      .attr('stroke-opacity', nodeStrokeOpacity)
      .attr('stroke-width', nodeStrokeWidth)
      .attr('r', 15)
      .attr('fill', theme.colors.gray[400]);

    node
      .append('text')
      .attr('fill', 'black')
      .attr('font-size', '11px')
      .text((n) => n.name);

    function ticked() {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${[d.x, d.y]})`);
    }

    simulation.on('tick', ticked);
  });

  return (
    <div className="App">
      <div>
        <svg ref={svgRef} />
      </div>
    </div>
  );
};

export default TopologyGraph;
