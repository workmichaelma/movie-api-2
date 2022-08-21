const config = {};

module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host:
        config.host || "movie-backend.csr0jb4deere.us-east-1.rds.amazonaws.com",
      port: config.port || "5432",
      database: env.NODE_ENV === "production" ? "movie" : "movie_dev",
      user: config.user || "michaelma",
      password: config.password || "footballwork",
      ssl: {
        rejectUnauthorized: false,
      },
    },
    debug: false,
    autoMigrate: true,
  },
});
