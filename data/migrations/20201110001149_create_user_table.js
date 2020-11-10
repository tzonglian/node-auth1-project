exports.up = function (knex) {
  return knex.schema.createTable("users", (tbl) => {
    tbl.increments();
    tbl.string("secret_user", 128).notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
