const express = require('express')
require('dotenv').config()
const apiKey = process.env.API_KEY
const bodyParser = require('body-parser')
const request = require('request')
const { resolve } = require('path')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
// using view engine ejs
app.use(express.static(resolve(__dirname + '/dist')))
// memberikan akses untuk directory public

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null })
})

app.post('/', (req, res) => {
  const city = req.body.city
  const urlAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  request(urlAPI, (error, response, body) => {
    try {
      if (error) {
        res.render('index', { weather: null, error: 'ada yang error' })
      }
      const weather = JSON.parse(body)
      if (weather.main === undefined) {
        res.render('index', { weather: null, message: 'Tidak ada kota yang diinput, SIilahkan input kan kota' })
      }
      const weatherResponse = `suhu di ${weather.name} saat ini adalah ${weather.main.temp}° C`
      res.render('index', { weather: weatherResponse, error: null })
    } catch (err) {
      res.render('index', { weather: null, error: 'Mohon masukkan kota' })
    }
  })
})

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`)
})
