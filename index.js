const express = require("express");
const Cerebras = require("@cerebras/cerebras_cloud_sdk")
const dotenv = require("dotenv");
const app = express();

// Connect to HTML, CSS, JS
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

// Read from ENV file
dotenv.config()
// Listen to Port 5000 - Return the Index File At / Page
const server = app.listen(5000);
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const io = require("socket.io")(server);

// Attach Listener to Port, Each Socket / User Gets Its Own Function
io.on("connection", function (socket) {
  // On Socket Receiving Chat Message Call
  socket.on("chat message", async (text) => {
    const client = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });

    const completionCreateResponse = await client.chat.completions.create({
    messages: [{ role: 'user', content: text }],
    model: 'gpt-oss-120b',
    max_completion_tokens: 200
  });

   socket.emit("bot reply", completionCreateResponse.choices[0].message.content);
  });
});
