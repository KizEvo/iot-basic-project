import dotenv from 'dotenv'
dotenv.config()
import mqtt from 'mqtt'
import express from 'express'

// Proxy server init
const app = express()
const port = 3000

// MQTT broker URL
const brokerUrl = process.env.MQTT_BROKER_URL

// MQTT client options with authentication
const options = {
  clientId: 'proxy_server', // Unique client ID
  clean: true, // Set clean session flag
  username: process.env.TB_ACCESS_TOKEN, // MQTT username
  connectTimeout: 8000,
}

// Create MQTT client
const client = mqtt.connect(brokerUrl, options)

// Connect: Event handlers, connect to Thingsboard
client.on('connect', () => {
  console.log('Connected to MQTT broker !')
})

// Error: Event handlers, run when error occured
client.on('error', (error) => {
  console.error('MQTT client error:', error)
  process.exit(1) // Exit when error occured
})

// ESP32 data received here then we forward it to Thingsboard instance using MQTT subscribe.
app.get('/esp32/data', (req, res) => {
  const { temperature } = req.query // ESP32 pass data via query, example localhost:5000/esp32/data?temperature=31.2
  console.log(`Forwarding data to Thingsboard: ${temperature}`)
  client.publish('v1/devices/me/telemetry', `{temperature:${temperature}}`)
})

// Listening for http request
app.listen(port, () => {
  console.log(`Proxy listening on port ${port}...`)
})
