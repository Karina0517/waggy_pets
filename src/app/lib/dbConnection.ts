import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.asPromise();
  }

  const uri = process.env.MONGODB_URI!;
  if (!uri) throw new Error("Falta la variable MONGODB_URI en .env");

  return mongoose.connect(uri, { dbName: "waggy" });
}
