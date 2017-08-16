
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'bob', password: 'abc123', email: 'bob@example.com', age: 30},
        {username: 'hello', password: 'world', email: 'hello@example.com', age: 10},
        {username: 'test', password: 'test', email: 'test@example.com', age: 50}
      ]);
    });
};
