import dotenv from 'dotenv'
dotenv.config()
import axios from "axios"
import mqtt from "mqtt"

const serverIp = process.env.TB_IP
const serverAccessToken = process.env.TB_ACCESS_TOKEN
const brokerUrl = process.env.MQTT_BROKER_URL

const getServerSideRPCCommands = () => {
	console.log("RPC http GET running...");
        return axios.get(`http://${serverIp}/api/v1/${serverAccessToken}/rpc?timeout=20000`).then((response) => {
                const {pin, value} = response.data.params;
                console.log("[SUCCESS]: Logging info...");
                console.log(response.data.params);
                console.log("Method: " + response.data.method);
                console.log(pin, value);
                return getServerSideRPCCommands(); // Call again
        }).catch(async (error) => {
                console.error("[ERROR]: Cannot get RPC command (" + error.code + ")");
                // Sleep for 5 seconds
                // await new Promise(resolve => setTimeout(resolve, 5000));
                return getServerSideRPCCommands(); // Call again
        }
)};

// MQTT client options with authentication
const options = {
  clientId: 'serveriot', // Unique client ID
  clean: true, // Set clean session flag
  username: process.env.MQTT_CLIENT_USERNAME, // MQTT username
  password: process.env.MQTT_CLIENT_PASSWORD, // MQTT password
  connectTimeout: 8000
};

// Call get RPC command function
getServerSideRPCCommands();

// Create MQTT client
const client = mqtt.connect(brokerUrl, options);

// Connect: Event handlers, connect to HiveMQ
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  // Subscribe to a topic
  client.subscribe('sensor1', (err) => {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
});

// Message: Event handlers, message received
client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
	axios.post('http://${serverIp}/api/v1/${serverAccessToken}/telemetry', {temperature: message.toString()})
	  .then(response => {})
	  .catch(error => {
	    console.error('Error:', error);
	  });
});

client.on('error', (error) => {
  console.error('MQTT client error:', error);
  process.exit(1); // Exit when error occured
});
