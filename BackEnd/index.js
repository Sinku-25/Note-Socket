import express from "express";
import { connection } from "./db/connection.js";
import { Server } from "socket.io";
import noteModel from "./db/models/note.model.js";
const app = express();
const port = 3000;
app.get("/", (req, res) => res.send("Hello World!"));
connection();
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
const io = new Server(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  socket.on("addNote", async (data) => {
    await noteModel.insertMany(data);
    let allNotes = await noteModel.find({});
    socket.emit("allNotes", allNotes);
  });
  socket.on("load", async () => {
    let allNotes = await noteModel.find({});
    socket.emit("allNotes", allNotes);
  });
  socket.on("deleteNote", async (data) => {
    await noteModel.findByIdAndDelete(data);
    let allNotes = await noteModel.find({});
    socket.emit("allNotes", allNotes);
  });
  socket.on("updateNote", async (data) => {
    let { id, title, description } = data;
    await noteModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    let allNotes = await noteModel.find({});
    socket.emit("allNotes", allNotes);
  });
});
