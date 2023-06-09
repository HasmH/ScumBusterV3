import express from "express";
import "./loadEnvironment.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})