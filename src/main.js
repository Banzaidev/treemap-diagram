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
  <h6 id='description'></h6>
  </div>
`

const videoGameData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json').then(data => data)
const movieSalesData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').then(data => data)
const kickstarterData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json').then(data => data)


const titlesDescriptions = [{'Video Game Sales':'Top 100 Most Sold Video Games Grouped by Platform'},
  {'Movie Sales':'Top 100 Highest Grossing Movies Grouped By Genre'}, 
  {'Kickstarter Pledges':'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'}]

const graphLegendSize = {
  graphWidth: 900,
  graphHeight: 600,
  legendWidth: 900,
  legendHeight: 300
}

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
  
  const root = d3.hierarchy(data)
  .sum((d)=> d.value)
  .sort((a,b) => b.value - a.value)

  const treeMap = d3.treemap().size([graphLegendSize.graphWidth, graphLegendSize.graphHeight]).padding(1)(root) 

  d3.select('#graph')
  .selectAll('g')
  .data(treeMap.leaves())
  .enter()
  .append('g')
  .attr('transform',d=>`translate(${d.x0},${d.y0})`)
  .append('rect')
  .attr('class','tile')
  .attr('data-name',d=> d.data.name)
  .attr('data-category',d=> d.data.category)
  .attr('data-value',d=> d.data.value)
  .attr('width', d=> `${d.x1 - d.x0}px`)
  .attr('height', d=> `${d.y1 - d.y0}px`)


}

d3.select('#app').
append('svg')
.attr('id','graph')
.attr('width',graphLegendSize.graphWidth)
.attr('height',graphLegendSize.graphHeight)

setTreemapTitleDescription(getTitleDescriptionData('video-game-data')[2],getTitleDescriptionData('video-game-data')[0], getTitleDescriptionData('video-game-data')[1] )
//deafult checked radio button

d3.select('#app')
.append('svg')
.attr('id','legend')
.attr('width',graphLegendSize.legendWidth)
.attr('height',graphLegendSize.legendHeight)


d3.selectAll('input')
.on('change',(e)=>{
  d3.selectAll('g').remove()

  const target = e.target
  const id = target.getAttribute('id')
  const titleDescrpitionData = getTitleDescriptionData(id)
  const title = titleDescrpitionData[0]
  const description = titleDescrpitionData[1]
  const data = titleDescrpitionData[2]

  setTreemapTitleDescription(data,title,description)

})
