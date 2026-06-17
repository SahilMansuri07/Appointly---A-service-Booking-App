import express from "express";
import pool from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import middleware from "./middleware/middleware.js";
import authRoutes from "./modules/v1/routes/auth-routes.js";
import adminRoutes from "./modules/v1/routes/admin-routes.js";
import userRoutes from "./modules/v1/routes/user-routes.js";

dotenv.config();
const PORT = process.env.PORT || 2107;
const app = express();

app.use(
  cors({
    origin: '*', // Update this to match your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text({ type: "text/plain" })); // To handle both JSON and text/plain content types
// Middleware to extract language from headers
// app.use(middleware.extractHeaderLanguage);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//   swaggerOptions: {
//     persistAuthorization: true,
//     authAction: {
//       apiKeyAuth: {
//         name: "apiKeyAuth",
//         schema: {
//           type: "apiKey",
//           in: "header",
//           name: "api-key",
//         },
//         value: process.env.API_KEY,
//       },
//     },
//   },
// }));


app.use("/uploads", express.static("uploads"));
app.use(middleware.tokenMiddleware);
app.use(middleware.checkApi);
app.use(middleware.decryption);


// API Routes
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/admin/", adminRoutes);

//uploads folder for static files

// Test database connection
async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("✓ Database connection established successfully");
    return true;
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
    return false;
  }
}


// Start server
async function startServer() {
  try {
    const isConnected = await testDbConnection();
    if (!isConnected) {
      process.exit(1);
    }
    
    // startCronJobs();
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();

 