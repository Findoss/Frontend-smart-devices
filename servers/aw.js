/* eslint array-element-newline: ["error", "never"] */

const WebSocketServer = require("websocket").server;
const http = require("http");

const initData = {
  dataHumidity: (() => {
    let array = [];
    for (let i = 0; i < 100; i++)
      array.push(Math.floor(Math.random() * (100 - 50) + 50));
    return array;
  })(),
  dateWatering: (() => Date.now() - 1000000)(),
  autotesting: false,
  wateringMode: true,
  sensorAnalysis: false,
  automaticWatering: true,
  humidity: 55,
  type: "aw",
  microcontroller: `Automatic watering 
  ${Math.floor(Math.random() * (10 - 1) + 1)}`
};

const wsServer = new WebSocketServer({
  httpServer: http
    .createServer()
    .listen(process.argv[2] ? process.argv[2] : 3000)
});

wsServer.on("request", request => {
  const connection = request.accept(null, request.origin);

  setInterval(() => {
    console.log("← send newHumidity");
    connection.send(
      JSON.stringify({
        event: "newHumidity",
        data: Math.floor(Math.random() * (100 - 50) + 50)
      })
    );
  }, 5000);

  setTimeout(() => {
    console.log("← send init");
    connection.send(
      JSON.stringify({
        event: "init",
        data: initData
      })
    );
  }, 1000);

  connection.on("message", message => {
    if (message.type === "utf8") {
      console.log(`← ${message.utf8Data}`);
      connection.send(message.utf8Data);
    }
  });

  connection.on("close", () => {
    console.log("→ close");
  });
});
