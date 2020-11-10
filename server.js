const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
require("colors");

const bcrypt = require("bcryptjs");
const session = require("express-session");
const sessionStore = require("connect-session-knex")(session);
const Project = require("./models/project-model");
const projectRouter = require("./routes/project-routes.js");

const server = express();
server.use(helmet());
server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

server.use(
  session({
    name: "myPokemon",
    secret: "theoretically, this should be from process.env", // the cookie is encrypted
    cookie: {
      maxAge: 1000 * 20,
      secure: false, // in production do true (https is a must)
      httpOnly: true, // this means the JS on the page cannot read the cookie
    },
    resave: false, // we don't want to recreate sessions that haven't changed
    saveUninitialized: false, // we don't want to persist the session 'by default' (GDPR!!!!)
    // storing the session in the db so it survives server restarts
    store: new sessionStore({
      knex: require("./data/config"),
      tablename: "sessions",
      sidfieldname: "sid",
      createTable: true,
      clearInterval: 1000 * 60 * 60,
    }),
  })
);

server.use("/api/users", projectRouter);

// [POST] register and login (we need to send paylod - req.body)
server.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    // do the hash, add the hash to the db
    const hash = bcrypt.hashSync(password, 10); // 2 ^ 10 rounds of hashing
    // we will insert a record WITHOUT the raw password but the hash instead
    const user = { username, password: hash };
    const addedUser = await Project.add(user);
    // send back the record to the client
    res.json(addedUser);
  } catch (err) {
    // res.status(500).json({ message: 'Something went terrible' }) // PRODUCTION
    res.status(500).json({ message: err.message });
  }
});

server.post("/api/login", async (req, res) => {
  // checks whether credentials legit
  try {
    // 1- use the req.username to find in the db the user with said username
    // 2- compare the bcrypt has of the user we just pulled against req.body.password
    const [user] = await Project.findBy({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      // 3- if user AND credentials good then save the session AND SEND COOKIE
      req.session.user = user;
      res.json({ message: `welcome back, ${user.username}` });
    } else {
      // 4- if no user, send back a failure message
      // 5- if user but credentials bad send packing
      res.status(401).json({ message: "bad credentials" });
    }
  } catch (err) {
    // res.status(500).json({ message: 'bad credentials' }); /// PRODUCTION
    res.status(500).json({ message: err.message });
  }
});

// [GET] logout no need for req.body
server.get("/logout", (req, res) => {
  if (req.session && req.session.user) {
    // we need to destroy the session
    req.session.destroy((err) => {
      if (err) res.json({ message: "you can not leave" });
      else res.json({ message: "good bye" });
    });
  } else {
    res.json({ message: "you had no session actually!" });
  }
});

server.get("/", (req, res) => {
  res.json({ api: "up" });
});
// POST at /api/login
// R
//router.post("/login", secure, (req, res) => {});

module.exports = server;
