const express = require('express');
const app = express();
const port = 1000;


app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.static('node_modules'));


const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");


app.use(userRoutes); 
app.use(adminRoutes); 


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
