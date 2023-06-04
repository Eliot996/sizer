import express  from "express";
const app = express();

app.use(express.static("./dist"));

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log("Server is running in port", PORT));