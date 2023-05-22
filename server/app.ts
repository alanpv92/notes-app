import express from "express";
import router from "./routes";
import cors from "cors";
const app = express();

app.use(cors());



app.use(express.json());

// app.use((req,res,next)=>{
//   console.log(req.body);
// })


app.use(router);

app.listen(5000, () => {
  console.log("my server is running");
});
