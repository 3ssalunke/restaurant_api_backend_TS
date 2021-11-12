import express from "express";
import "dotenv/config";
import CompositionRoot from "./compositionRoot";

const PORT = process.env.PORT;

CompositionRoot.configure();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", CompositionRoot.authRouter());
app.use("/restaurants", CompositionRoot.restaurantRouter());

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
