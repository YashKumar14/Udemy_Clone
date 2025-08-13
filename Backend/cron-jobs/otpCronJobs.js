const cron = require("node-cron");
const { pool } = require("../db_connections/connections");

const cronInterval = process.env.CRON_INTERVAL || "1";
cron.schedule(`*/${cronInterval} * * * *`, async () => {
  try {
    await pool.query(`
      UPDATE otp_codes
      SET is_expired = true
      WHERE expires_at <= NOW() AND is_expired = false`);
    console.log("Expired OTPs have been updated at", new Date());
  } catch (error) {
    console.error("Error updating expired OTPs:", error);
  }
});

cron.schedule("* * * * *", async () => {
  try {
    await pool.query(`
      DELETE FROM otp_codes
      WHERE is_expired = true`);
    console.log("Expired OTPs have been deleted at", new Date());
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
});
