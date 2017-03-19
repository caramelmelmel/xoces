import * as d3 from 'd3';
import {arcEnterTween, arcExitTween, ARC_TRANSITION_DURATION} from './animation'
import {getScheme} from './style'
import {computeDimensions} from './layout'
import {radiansToDegrees, polarToRectangular} from './geometry'

export const ARC_CLASS_NAME = 'ARC_CLASS_NAME'
export const SUB_ARC_CLASS_NAME = 'SUB_ARC_CLASS_NAME'
export const ARC_LABEL_CLASS_NAME = 'ARC_LABEL_CLASS_NAME'
export const SUB_ARC_LABEL_CLASS_NAME = "SUB_ARC_LABEL_CLASS_NAME"
export const CHORD_CLASS_NAME = 'CHORD_CLASS_NAME'
export const CHORD_ARROW_CLASS_NAME = 'CHORD_ARROW_CLASS_NAME'

export const init = (chordVis, props) => {
  let scheme = getScheme(props.colorScheme)

  chordVis
  .style('height', props.height)
  .style('width', props.width)
  .style('background', scheme.background);

  let w = parseFloat(chordVis.style('width'), 10);
  let h = parseFloat(chordVis.style('height'), 10);

  // console.log('arc', innerRadius, outerRadius)

  let drawingGroup = chordVis.append('g')
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  return {drawingGroup, w, h}
}

export const drawArcs = (props) => {
  let data = props.data;
  // let arc = props.arc;

  let {innerRadius, outerRadius} = computeDimensions(props.w, props.h);

  let arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  let arcGroup = props.selection
    .selectAll(`path.${props.className}`)
    .data(data, d => d.id);

  arcGroup.exit()
    // .transition()
    // .duration( ARC_TRANSITION_DURATION )
    // .ease('cubic-in-out')
    // .attrTween('d', arcExitTween)
    .remove();


  arcGroup.enter()
    .append('path')
    .attr('d', arc)
    .attr('class', d => props.className)
    .style('fill', d => d.fill)
    .style('stroke', d => d.stroke);

  // arcGroup.attr('d', arc)
  //   .style('fill', (d, i) => d.fill.default)
  //   .transition()
  //   .duration(ARC_TRANSITION_DURATION)
  //   .ease('cubic-in-out')
  //   .attrTween('d', arcEnterTween)
  //
  // arcGroup.enter()
  //   .append('svg:path')
  //   .attr('data-model-id', (d,i) => d.model.id)
  //   .attr('d', arc)
  //   .transition()
  //   .duration( ARC_TRANSITION_DURATION )
  //   .ease('cubic-in-out')
  //   .attrTween('d', arcEnterTween)

  return arcGroup;
}

export const drawLabels = (props) => {
  // console.log('drawLabels props', props);

	let text = props.selection.selectAll(`text.${props.className}`)
		.data(props.data, d => d.id);

  // console.log('label exit', text.exit())

  text.exit()
    .remove();

	text.enter()
    .append('svg:text')
    .attr( 'class', d => props.className)
    .attr( 'fill', d => d.fill)
		.attr('x', (d, i) => d.position.x)
		.attr('y', (d, i) => d.position.y)
		.attr('text-anchor', (d, i) => d.textAnchor)
		.attr('transform', (d, i) => 'translate(' + d.translation.x + ',' + d.translation.y + ') rotate(' + d.rotation + ',' + d.position.x + ',' + d.position.y + ')')
    .style( 'font-size', d => d.fontSize)
    .style('opacity', d => d.opacity)
		.text( d => d.text )


    return text
}

export const drawChords = (props) => {
  let {innerRadius, outerRadius} = computeDimensions(props.w, props.h);

  let ribbon = d3.ribbon()
    .radius(innerRadius);

  let chordGroup = props.selection.selectAll(`path.${props.className}`)
		.data(props.data, d => d.id);

  let arrowGroup = props.selection.selectAll(`.${CHORD_ARROW_CLASS_NAME}`)
    .data(props.data, d => d.id);

  chordGroup.exit().remove();

	chordGroup.enter()
    .append('path')
    .attr( 'class', d => props.className)
    // .style( 'fill', '#ff0000')
    .style( 'stroke', d => d.stroke)
    .attr('d', ribbon)
    .style('opacity', d => d.opacity)

  arrowGroup.exit().remove()

  arrowGroup.enter()
    .append('polygon')
    .attr('points', "-5,11 0,0 5,11")
    .attr('class', CHORD_ARROW_CLASS_NAME)
    .attr('xlink:href', '#arrow')
    .attr('x', d => polarToRectangular({r: innerRadius, theta: d.source.startAngle}).x )
    .attr('y', d => polarToRectangular({r: innerRadius, theta: d.source.startAngle}).y )
    .style('fill', d => d.stroke)
    .attr('transform', function(d) {
      let rotationAngle = radiansToDegrees(2*Math.PI - d.source.startAngle);
      let {x, y} = polarToRectangular({r: innerRadius, theta: d.source.startAngle})
      // return 'translate(' + d.target.translation.x + ',' + d.target.translation.y + ')' + ' rotate(' + -rotationAngle + ',' + posX + ',' + posY + ')';
      return `translate(${x}, ${y})` + ` rotate(${-rotationAngle}, ${0}, ${0})`;
    });
}

function _arrow() {

}
