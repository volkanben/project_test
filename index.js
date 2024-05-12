const express = require('express');
const app = express();
const port = 1000;  

app.set("view engine", "ejs");

app.use(express.static('public'));

const db = require("./data/get_question");

app.use(express.static('node_modules'));

const userRoutes = require("./routes/user");

const adminRoutes = require("./routes/admin");

app.use(adminRoutes);
app.use(userRoutes);


    app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});