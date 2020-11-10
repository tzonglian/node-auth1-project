const db = require("../data/config");

// create functions for your endpoints

module.exports = {
  /// function names
  getUsers,
  add,
  findBy,
};

function getUsers() {
  return db("users");
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id");

    return db("users");
  } catch (error) {
    throw error;
  }
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}
