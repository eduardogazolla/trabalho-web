const express = require("express");
const app = express();
const port = 3000;
const db = require("./database/db");
const routes = require("./routes/appRoutes");

app.use(express.json());

db.sync();

app.use("/", routes);   

app.listen(port, () => {
  console.log(`app on http://localhost:${port}`);
});
