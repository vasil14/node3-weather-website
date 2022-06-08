const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname);
// console.log(path.join(__dirname,'../public','about.html'));

const app = express()

// Define paths for Expres config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname,"../templates/views")
const partialPaths = path.join(__dirname,"../templates/partials")

// Setup handlers engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPaths)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
  res.render('index', {
    title: 'Weather',
    name: 'Vasil Vangjeli'
  })
})

app.get('/about',(req, res)=>{
  res.render('about',{
    title:'About Me',
    name:'Vasil Vangjeli'
  })
})

app.get('/help', (req, res)=>{
  res.render("help", {
    title: "Help Page",
    message:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    name: "Vasil Vangjeli",
  });
})


app.get("/weather", (req, res) => {
  if(!req.query.address){
    return res.send({
      error: 'You must provide an address!'
    })
  }

  geocode(req.query.address, (error,{latitude, longitude, location}={})=>{
    if(error){
      return res.send({error})
    }

    forecast(latitude, longitude, (error, forecastData)=>{
      if(error){
        return res.send({error})
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })

  // res.send({
  //   Forecast: 'Sunny',
  //   Location: 'Tirana',
  //   address: req.query.address
  // });
});

app.get('/products', (req, res)=>{
  if (!req.query.search){
    return res.send({
      erorr: 'You must provide a search term'
    })
  }
  console.log(req.query.search);
  res.send({
    product: []
  })
})

app.get('/help/*', (req, res)=>{
  res.render("error", {
    errorMessage: "Help article not found",
    name: "Vasil Vangjeli",
  });
})

app.get('*', (req, res)=>{
  res.render("error", {
    title: 404,
    errorMessage: "Page not found!",
    name: "Vasil Vangjeli",
  });
})


app.listen(3000, ()=> {
  console.log('Server is up on port 3000.');
})