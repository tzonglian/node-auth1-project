exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, username: "Pikachu", password: "pika-secret" },
        { id: 2, username: "Eevee", password: "eevee-secret" },
        { id: 3, username: "Charmander", password: "char-secret" },
      ]);
    });
};
