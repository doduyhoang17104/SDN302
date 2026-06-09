require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRouters")
const toyRoutes = require("./routes/toyRoutes");
const uploadImageRoutes = require("./routes/uploadImageRoutes");
const bookingRoutes = require("./routes/bookingRoutes.js");
const app = express()
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
app.use(cors())
app.use(express.json())

// connect mongodb
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("MongoDB Connected")
})
.catch((err)=>{
  console.log("MongoDB Error:",err)
})

// routes
app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/toys", toyRoutes);
app.use("/api/upload", uploadImageRoutes);
app.use("/api/bookings", bookingRoutes);
// port
const PORT = process.env.PORT

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
});