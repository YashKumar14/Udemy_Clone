const cron = require("node-cron");
const { pool } = require("../db_connections/connections");

const expireInterval = process.env.CRON_EXPIRE_INTERVAL || "* * * * *";
const deleteInterval = process.env.CRON_DELETE_INTERVAL || "* * * * *";

// Function to update expired OTPs
const updateExpiredOTPs = async () => {
  try {
    if (!pool) return;
    const result = await pool.query(`
      UPDATE otp_codes
      SET is_expired = true
      WHERE expires_at <= NOW() AND is_expired = false
      RETURNING otp_id
    `);

    if (result.rowCount > 0) {
      console.log(`${result.rowCount} OTP(s) expired at`, new Date());
    }
  } catch (error) {
    console.error("Error updating expired OTPs:", error.message);
  }
};

// Function to delete expired OTPs
const deleteExpiredOTPs = async () => {
  try {
    if (!pool) return;

    const result = await pool.query(`
      DELETE FROM otp_codes
      WHERE is_expired = true
      RETURNING otp_id
    `);

    if (result.rowCount > 0) {
      console.log(`${result.rowCount} expired OTP(s) deleted at`, new Date());
    }
  } catch (error) {
    console.error("Error deleting expired OTPs:", error.message);
  }
};

// Schedule cron jobs
cron.schedule(expireInterval, updateExpiredOTPs, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});

cron.schedule(deleteInterval, deleteExpiredOTPs, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});
