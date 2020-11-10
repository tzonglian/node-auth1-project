const router = require("express").Router();
const Project = require("../models/project-model");

const currentTime = new Date().toDateString();

// @desc			Test endpoint is working
// @route			/test
router.get("/test", (req, res) => {
  res.status(200).json({ message: "server running " + currentTime });
});

// put this middleware in a centralized location
function secure(req, res, next) {
  // check if there is a user in the session
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You shall not pass!" });
  }
}

// GET at /api/users
// Returns array of users if logged in
// Else returns "You shall not pass"
router.get("/", secure, (req, res) => {
  Project.getUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
