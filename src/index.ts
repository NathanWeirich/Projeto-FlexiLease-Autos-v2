import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
