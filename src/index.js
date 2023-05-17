const express = require("express");

const app = express();

// The port on which the Microservice runs
const PORT = 3001;

// Assigning the routes to the "/" URI
const homeRouter = require("./routes/home");
app.use("/", homeRouter);

// Assigning the routes to the "/cnv" URI
const opRouter = require("./routes/cnv");
app.use("/cnv", opRouter);

app.listen(PORT, () => {
  console.log(`Microservice available at: http://localhost:${PORT}/`);
});