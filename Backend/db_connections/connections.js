// const { Pool } = require("pg");
// const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// const pool = new Pool({
//   host: DB_HOST,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_DATABASE,
//   port: DB_PORT,
// });

// const connectToDatabase = async () => {
//   try {
//     await pool.connect();

//     console.log("connected to postgresql");

//     const createTable = `
//     CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     fullname VARCHAR(150) NOT NULL,
//     email VARCHAR(150) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
//     `;

//     const createOtpTable = `
//     CREATE TABLE IF NOT EXISTS otp_codes (
//     id SERIAL PRIMARY KEY,
//     email VARCHAR(150) NOT NULL,
//     otp VARCHAR(6) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     expires_at TIMESTAMP NOT NULL,
//     is_expired BOOLEAN);
//     `;

//     await pool.query(createTable);
//     await pool.query(createOtpTable);
//   } catch (error) {
//     console.error("Error while creating table:", error);
//   }
// };

// connectToDatabase();
// module.exports = { pool };

const { Pool } = require("pg");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_DEFAULT } =
  process.env;

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
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
        name: "user_details",
        query: `
          CREATE TABLE IF NOT EXISTS user_details (
          user_id SERIAL PRIMARY KEY,
          user_fullname VARCHAR(150) NOT NULL,
          user_email VARCHAR(150) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          user_role VARCHAR(50) NOT NULL CHECK (user_role IN ('learner', 'instructor')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
       `,
      },
      {
        name: "otp_codes",
        query: `
          CREATE TABLE IF NOT EXISTS otp_codes (
          id SERIAL PRIMARY KEY,
          email VARCHAR(150) NOT NULL,
          otp VARCHAR(6) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NOT NULL,
          is_expired BOOLEAN
          );
        `,
      },
      // {
      //   name: "projects_data",
      //   query: `
      //     CREATE TABLE IF NOT EXISTS projects_data (
      //     project_id SERIAL PRIMARY KEY,
      //     project_name VARCHAR(150) NOT NULL UNIQUE
      //     ) ;
      //   `,
      // },
      // {
      //   name: "courses_data",
      //   query: `
      //     CREATE TABLE IF NOT EXISTS courses_data (
      //     course_id SERIAL PRIMARY KEY,
      //     project_id INT NOT NULL,
      //     course_title VARCHAR(150) NOT NULL,
      //     course_description TEXT,
      //     course_image VARCHAR(255) NOT NULL,
      //     created_by VARCHAR(150) NOT NULL,
      //     uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      //     CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects_data(project_id) ON DELETE CASCADE,
      //     CONSTRAINT unique_project_course UNIQUE (project_id, course_title)
      //     );
      //   `,
      // },
      // {
      //   name: "courses_url",
      //   query: `
      //     CREATE TABLE IF NOT EXISTS courses_url (
      //     video_asset_id SERIAL PRIMARY KEY,
      //     course_id INT NOT NULL,
      //     video_description TEXT,
      //     video_url VARCHAR(255) NOT NULL,
      //     CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses_data(course_id) ON DELETE CASCADE
      //     );
      //  `,
      // },
    ];

    for (const table of tableQueries) {
      await checkAndCreateTable(table.name, table.query);
    }
  } catch (error) {
    console.error("Error while creating table:", error.message);
  }
};

createDatabase(DB_DATABASE);
module.exports = { pool };
