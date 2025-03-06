import './style.css'
import * as d3 from "d3"

document.querySelector('#app').innerHTML = `
  <div>
    <div id='dataSelector'>
      <input type="radio" checked name="data-selector" id="video-game-data">
      <label for="video-game-data">Video Game Data </label>
      <input type="radio" name="data-selector" id="movie-data-set">
      <label for="movie-data-set">Movie Data Set</label>
      <input type="radio" name="data-selector" id="kickstarter-data-set">
      <label for="kickstarter-data-set">Kickstarter Data Set</label>
    </div>

    <h1 id='title'></h1>
    <h5 id='description'></h5>
    <div id='graphLegend'></div>
  </div>
`

const videoGameData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json').then(data => data)
const movieSalesData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').then(data => data)
const kickstarterData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json').then(data => data)


const titlesDescriptions = [{'Video Game Sales':'Top 100 Most Sold Video Games Grouped by Platform'},
  {'Movie Sales':'Top 100 Highest Grossing Movies Grouped By Genre'}, 
  {'Kickstarter Pledges':'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'}]

const graphLegendSize = {
  graphWidth: 960,
  graphHeight: 570,
  legendWidth: 500,
  legendHeight: 300
}

const rectLabelLegendSize = {
  legendRectWidth:15,
  legendColumnSpace:(15 * 10),//distance betweeen column
  legendRowSpace:10,
  legendTextRowOffset:5,
  legendTextColumnOffset:-2
}

const colorLegendTile = d3.scaleOrdinal(d3.schemeCategory10) //d3.schemeCategory10 = 10 predefined colors
/* .domain = legendData .range = d3.schemeCategory10 */

function getTitleDescriptionData(id){
  switch(id){
    case 'video-game-data':
      return [Object.keys(titlesDescriptions[0])[0], titlesDescriptions[0]['Video Game Sales'],videoGameData]
    case 'movie-data-set':
      return [Object.keys(titlesDescriptions[1])[0],titlesDescriptions[1]['Movie Sales'],movieSalesData]
    case 'kickstarter-data-set':
      return [Object.keys(titlesDescriptions[2])[0],titlesDescriptions[2]['Kickstarter Pledges'],kickstarterData]
  }
}

function setTreemapTitleDescription(data,title,description){
  d3.select('#title').html(title)
  d3.select('#description').html(description)
  
  const hierarchy = d3.hierarchy(data)
  .sum((d)=> d.value)
  .sort((a,b) => b.value - a.value)


  const treeMap = d3.treemap().size([graphLegendSize.graphWidth, graphLegendSize.graphHeight]).padding(0)

  const root = treeMap(hierarchy)

  d3.select('#graph')
  .selectAll('g')
  .data(root.leaves())
  .enter()
  .append('g')
  .attr('transform',d=>`translate(${d.x0},${d.y0})`)
  .append('rect')
  .attr('stroke','white')
  .attr('class','tile')
  .attr('data-name',d=> d.data.name)
  .attr('data-category',d=> d.data.category)
  .attr('data-value',d=> d.data.value)
  .attr('width', d=> `${d.x1 - d.x0}`)
  .attr('height', d=> `${d.y1 - d.y0}`)
  .attr('fill', d=> colorLegendTile(d.data.category))
}

function getLegendData(data){
  const children = data.children
  let legendData = []
  children.forEach((element) => legendData.push(element.name))
  return legendData
}

function setLegend(legendData){

  const elementPerRow = Math.floor((graphLegendSize.legendWidth)/(rectLabelLegendSize.legendColumnSpace))

  d3.select('#legend')
  .selectAll('g')
  .data(legendData)
  .enter()
  .append('g')
  .attr("transform", (d, i) => `translate(${(i % elementPerRow) * rectLabelLegendSize.legendColumnSpace}, ${(Math.floor(i / elementPerRow) * rectLabelLegendSize.legendRectWidth) + (rectLabelLegendSize.legendRowSpace * Math.floor(i / elementPerRow))})`)
  .append('rect')
  .attr('width', rectLabelLegendSize.legendRectWidth)
  .attr('height',rectLabelLegendSize.legendRectWidth)
  .attr('class','legend-item')
  .attr('fill',d=> colorLegendTile(d))

  d3.select('#legend')
  .selectAll('g')
  .append('text')
  .attr('x', rectLabelLegendSize.legendRectWidth + rectLabelLegendSize.legendTextRowOffset)
  .attr('y',rectLabelLegendSize.legendRectWidth + rectLabelLegendSize.legendTextColumnOffset)
  .text(d => d)
  

}

d3.select('#graphLegend').
append('svg')
.attr('id','graph')
.attr('width',graphLegendSize.graphWidth)
.attr('height',graphLegendSize.graphHeight)

setTreemapTitleDescription(getTitleDescriptionData('video-game-data')[2],getTitleDescriptionData('video-game-data')[0], getTitleDescriptionData('video-game-data')[1] )
//deafult checked radio button



d3.select('#graphLegend')
.append('svg')
.attr('id','legend')
.attr('width',graphLegendSize.legendWidth)
.attr('height',graphLegendSize.legendHeight)

//deafult legend
setLegend(getLegendData(getTitleDescriptionData('video-game-data')[2]))

d3.selectAll('input')
.on('change',(e)=>{
  d3.selectAll('g').remove()
  
  const target = e.target
  const id = target.getAttribute('id')
  const titleDescrpitionData = getTitleDescriptionData(id)
  const title = titleDescrpitionData[0]
  const description = titleDescrpitionData[1]
  const data = titleDescrpitionData[2]
  //set treemap, title and description
  setTreemapTitleDescription(data,title,description)

  const legendData = getLegendData(data)
  //set Legend
  setLegend(legendData)
  

})
