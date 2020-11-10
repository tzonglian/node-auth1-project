exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, secret_user: "Pikachu" },
        { id: 2, secret_user: "Eevee" },
        { id: 3, secret_user: "Charmander" },
      ]);
    });
};
