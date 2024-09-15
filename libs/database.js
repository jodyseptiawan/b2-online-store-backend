const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "OnlineStore",
  password: "root",
  port: 5432,
});

// Connect to PostgreSQL database
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL", err);
  });

module.exports = client;
