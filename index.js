const express = require("express");
const OpenAI = require("openai");

const app = express();

// Connect to HTML, CSS, JS
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// Listen to Port 5000 - Return the Index File At / Page
const server = app.listen(5000);
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const io = require("socket.io")(server);

// Attach Listener to Port, Each Socket / User Gets Its Own Function
io.on("connection", function (socket) {
  console.log("Io connected");
  // On Socket Receiving Chat Message Call
  socket.on("chat message", async (text) => {
    const client = new OpenAI({ apiKey: process.env.OpenAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-4",
      input: text,
    });

    socket.emit("bot reply", response.output_text);
  });
});
