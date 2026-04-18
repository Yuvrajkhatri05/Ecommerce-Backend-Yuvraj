require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const Port = process.env.PORT || 8000;
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

app.use(cors({
  origin: "http://localhost:4300",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: "Too many requests from this IP, please try again later."
});
app.use(apiLimiter);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4300",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

// Attach socket.io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("register", (userId) => {
    socket.join(userId);
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./Public")));
// Static Folder (for images)
app.use("/uploads", express.static(path.join(__dirname, "Public/uploads")));

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./Configuration/swagger");
// Swagger Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// AUTH APIs
app.use("/auth", require("./Routes/authRoutes"));

// USER APIs
app.use("/user", require("./Routes/userRoutes"));

// SELLER APIs
app.use("/seller", require("./Routes/sellerRoutes"));

// PRODUCT APIs
app.use("/product", require("./Routes/productRoutes"));

// ORDER APIs
app.use("/order", require("./Routes/orderRoutes"));

// PAYMENT APIs
app.use("/payment", require("./Routes/paymentRoutes"));

server.listen(Port, () => console.log(`Server Started at PORT:${Port}`));