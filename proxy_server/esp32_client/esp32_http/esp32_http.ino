#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"
#include "arduino_secrets.h"

#define DHTPIN (4U)
#define DHTTYPE DHT11   // DHT 11

const char* ssid = SECRET_WIFI_SSID;
const char* password = SECRET_WIFI_PASSWORD;

//Your Domain name with URL path or IP address with path
String serverName = SECRET_SERVER_URL;

//Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
unsigned long timerDelay = 3000;

void setup() {
  Serial.begin(115200); 

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
  // Start DHT
  dht.begin();
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      HTTPClient http;

      float t = dht.readTemperature();

      // Check if any reads failed and exit early (to try again).
      if (isnan(t)) {
        Serial.println(F("Failed to read from DHT sensor!"));
        return;
      }

      String serverPath = serverName + "?temperature=" + String(t);
      
      // Domain name with URL path or IP address with path
      http.begin(serverPath.c_str());
      
      // Send HTTP GET request
      int httpResponseCode = http.GET();
      
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        //String payload = http.getString();
        //Serial.println(payload);
      }
      else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      // Free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
