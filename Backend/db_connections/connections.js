const { Pool } = require("pg");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_DEFAULT } =
  process.env;

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

const createDatabase = async (dbname) => {
  const dbPool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DEFAULT,
    port: DB_PORT,
  });

  try {
    await dbPool.connect();

    console.log("checking prostgres");

    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname=$1`;
    const checkDbResult = await dbPool.query(checkDbQuery, [dbname]);

    // console.log(checkDbResult);

    if (checkDbResult.rowCount === 0) {
      const createDbQuery = `CREATE DATABASE ${dbname}`;
      await dbPool.query(createDbQuery);

      console.log(`Database ${dbname} created successfully`);
    } else {
      console.log(`Database ${dbname} already exists`);
    }
    await connectToDatabase();
  } catch (error) {
    console.error("Error while creating database: ", error);
  }
};

const checkAndCreateTable = async (tableName, createTableQuery) => {
  try {
    console.log(`Checking for table "${tableName}"...`);

    const checkTableQuery = `
      SELECT 1 FROM pg_tables
      WHERE schemaname = 'public' AND tablename = $1;
    `;
    const result = await pool.query(checkTableQuery, [tableName]);

    if (result.rowCount === 0) {
      await pool.query(createTableQuery);
      console.log(`Table "${tableName}" created successfully.`);
    } else {
      console.log(`Table "${tableName}" already exists.`);
    }
  } catch (error) {
    console.error(`Error handling table "${tableName}":`, error.message);
  }
};

const connectToDatabase = async () => {
  try {
    await pool.connect();

    console.log("connected to postgresql");

    const tableQueries = [
      {
        name: "user_roles",
        query: `
          CREATE TABLE IF NOT EXISTS user_roles (
          role_id SERIAL PRIMARY KEY,
          role_name VARCHAR(150) UNIQUE NOT NULL 
          );
        `,
      },
      {
        name: "user_details",
        query: `
          CREATE TABLE IF NOT EXISTS user_details (
          user_id SERIAL PRIMARY KEY,
          user_fullname VARCHAR(150) NOT NULL,
          user_email VARCHAR(150) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          user_role_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT  fk_role FOREIGN KEY (user_role_id) REFERENCES user_roles(role_id)
          );
       `,
      },
      {
        name: "otp_codes",
        query: `
          CREATE TABLE IF NOT EXISTS otp_codes (
          otp_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES user_details(user_id) ON DELETE CASCADE,
          otp VARCHAR(6) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NOT NULL, 
          otp_attempts INT DEFAULT 0,
          block_until TIMESTAMP DEFAULT NULL,
          is_expired BOOLEAN DEFAULT FALSE,
          CONSTRAINT unique_user_id UNIQUE (user_id)
          );
        `,
      },
    ];

    for (const table of tableQueries) {
      await checkAndCreateTable(table.name, table.query);
    }

    const insertRolesQuery = `
      INSERT INTO user_roles(role_name)
      VALUES ('admin'), ('instructor'), ('learner')
      ON CONFLICT (role_name) DO NOTHING;
    `;

    await pool.query(insertRolesQuery);
  } catch (error) {
    console.error("Error while creating table:", error.message);
  }
};

createDatabase(DB_NAME);
module.exports = { pool };
