import app from "./app.js";

const PORT = process.env.port || 8081;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
