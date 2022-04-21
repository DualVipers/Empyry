export default {
    client: "sqlite3",
    connection: {
        filename: "./database.sqlite3",
    },
    migrations: { directory: "./src/migrations" },
};
