"use strict";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

const socket = io();

// Listen to Result on Front-End, Pass to Server to Be Processed with AI API
document.querySelector("button").addEventListener("click", () => {
  recognition.start();
  console.log("Starting recogniton...");
});

recognition.addEventListener("speechstart", () => {
  console.log("Speech has been detected.");
});

recognition.addEventListener("result", (e) => {
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  console.log("Confidence: " + e.results[0][0].confidence);
  console.log("Text is ",text);
  document.querySelector(".output-you").textContent=text;

  //Using Socket.IO to Pass to Server
  socket.emit("chat message", text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.onerror = (e) => console.error(e.error);

// Text to Speech
function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}
// Receive Text From Socket
socket.on("bot reply", function (botResponse) {
  document.querySelector(".output-bot").textContent=botResponse;
  synthVoice(botResponse);
});
