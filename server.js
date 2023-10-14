import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connect } from "./database/connection.js";
import router from "./router/route.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powerd-by");
app.use(express.urlencoded({extended: true})); 

const port = 8080;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.status(201).json("Home GET request.");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", router);

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to server.");
    }
  })
  .catch((error) => {
    console.log("Cannot connect to database.");
  });
