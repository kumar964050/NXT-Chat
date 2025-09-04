import "dotenv/config"; // Load environment variables
import connectDB from "./config/database";
import app from "./app";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB().catch((error) => {
  console.error(`DB Error :${error.message}`);
  console.error(error);
  process.exit(1);
});
