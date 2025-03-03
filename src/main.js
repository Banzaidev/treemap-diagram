import './style.css'
import * as d3 from "d3"

document.querySelector('#app').innerHTML = `
  <div>
  <h1 id='title'></h1>
  <h6 id='description'></h6>
  </div>
`
const videoGameData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json').then(data => data)
const movieSalesData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').then(data => data)
const kickstarterData = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json').then(data => data)


function findInfo(data){
  const title = data.name //id = title
  const children = data.children 

  let allGroups = []; //platform, genre, category
  children.forEach((element) => allGroups.push(element.name) );
  let allData = [] //games, movie, kickstarter projects


  children.forEach((child) => {
    const data = child.children
    data.forEach((el) => allData.push(el))

  })

  let allDataGroups = []

  allGroups.forEach((group)=>{
    
    let data = []
    for(let i=0; i < allData.length; i++){
      const category = allData[i].category
      const name = allData[i].name
      const value = allData[i].value
      if(group == category ){
        data.push([name,value])
      }
    }
    allDataGroups.push({[group]: data})
  })

  return [title, allGroups, allDataGroups]
}


