const express = require('express');
const router = require("./routes/routes");
require("dotenv").config();
const app = express();
const { PORT } = process.env;

app.use(express.json());
app.set('view engine', 'ejs');
app.use("/", router);

app.listen(PORT, () => console.log('server running'));