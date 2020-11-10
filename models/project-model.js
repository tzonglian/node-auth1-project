const db = require("../data/config");

// create functions for your endpoints

module.exports = {
  /// function names
  getUsers,
  register,
  login,
};

function getUsers() {
  return db("users");
}

function register() {
  return db("users");
}

function login() {
  return db("users");
}
