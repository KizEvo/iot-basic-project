# IoT Development
## How the system works
- I use a dedicated VM server provided by [DESLab](https://deslab.vn/) to run [Thingsboard docker instance](https://thingsboard.io/docs/user-guide/install/docker/).

  - It doesn't have a public IP address nor a domain name. So in order access it remotely from my laptop while I'm in a different LAN; I use [Tailscale VPN](https://tailscale.com/)
- For hardware I choose ESP32 for development because of the WiFi capability it provided and a DHT11 temperature/humidity sensor.
- The ESP32 get data from the sensor and use an appropriate communication protocol (HTTP/MQTT...) to send data to Thingsboard instance.
- To accomplish that I try different approach to the problem and each solution is provided in a directory which includes the code for the ESP32 and the server code

## How to use the code
- When you open the code you should see some "SECRET_" (arduino_secrets.h) and environment variable (.env) so you should include them if you wish you use the code.

## HiveMQ system
<div align="center">
	<img src="https://github.com/KizEvo/iot-basic-project/assets/104358167/17f0baa8-e585-46bb-98ca-faa5eb8ba781">
</div>
