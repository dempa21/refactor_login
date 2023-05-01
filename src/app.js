import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import database from "./db.js";
import config from "./config.js";
import socket from "./socket.js";
import sessionsRouter from "./routes/sessions.router.js"
import productsRouter from "./routes/product.router.js";
import cartsRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import passport from "passport";
import initializePassport from "./auth/passport.js";
import __dirname from "./utils.js";

// Initialization
const app = express();



// Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(`${__dirname}/public`));
app.use(morgan("dev"));
initializePassport();
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.dbUrl,
      ttl: 60,
    }),
    resave: true,
    saveUninitialized: false,
    secret: config.sessionSecret,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Settings
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Database connection
database.connect();

// Routes
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(8080, (req, res) => {
  console.log("Listening on port 8080");
});

// socket.connect(httpServer);
