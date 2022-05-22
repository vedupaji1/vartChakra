const express = require("express")
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http)
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const port = process.env.PORT || 8000;


app.get('/temp', (req, res) => {
    res.send("Hello Bro");
})


app.use(express.static(path.join(__dirname, "client/build")));

app.get("/*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

http.listen(port, () => {
    console.log("Ok");
})

io.on('connection', (socket) => {
    console.log("Connected Done Using Sockets");
})
