import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "employeeDB",
    });
    console.log("Database Connected");

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Database connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default connectDB;
