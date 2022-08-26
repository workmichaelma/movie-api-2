const config = {};

module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env(
        "DATABASE_HOST",
        "movie-backend.csr0jb4deere.us-east-1.rds.amazonaws.com"
      ),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "movie"),
      user: env("DATABASE_USERNAME", "michaelma"),
      password: env("DATABASE_PASSWORD", "footballwork"),
      ssl: {
        rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false), // For self-signed certificates
      },
    },
    debug: false,
    autoMigrate: true,
  },
});
