const mailTemplate = (username, otp, expireTime, cid) => {
  const logoUrl =
    "https://res.cloudinary.com/dz5875n7t/image/upload/v1762346479/logo-udemy_mjngew.png";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
        #main {
            padding: 25px 30px;
            background-color: #3e4143;
        }

        #logo {
            padding: 20px;
            background-color: #101112;
            border-bottom: 1px solid #d1d7dc;
        }

        #logo img {
            z-index: 10;
        }

        #content {
            padding: 20px;
            background-color: #101112;
            color: #fff;
            font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, Roboto,
            "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol";
            font-size: 14px;
            line-height: 1.4;
            border-bottom: 1px solid #d1d7dc;
        }

        #content h4,
        h1 {
            margin: 0px 0px 10px;
        }

        #otp {
            background-color: #2d2f31;
            text-align: center;
            margin: 20px 0px;
        }
        #footer {
            padding: 10px 20px;
            background-color: #101112;
            color: #6a6f73;
        }
        a {
            text-decoration: underline;
            color: #7325a3;
        }
        </style>
    </head>

    <body>
        <div id="main">
        <div id="logo">
            <img src="${logoUrl}" alt="logo" width="75" height="28" />
        </div>

        <div id="content">
            <h4>Hi ${username},</h4>
            <h4>Use the code below to log in to your Udemy account.</h4>
            <h1 id="otp">${otp}</h1>
            <h4>This code expires in ${expireTime}.</h4>
            <h4>
            Didn't request this code?
            <a href="#">Contact us.</a>
            </h4>
        </div>
        <div id="footer">
            <h5>
            Delivered by Udemy
            <a href="#"
                >600 Harrison Street, 3rd Floor, San Francisco, CA 94107.</a
            >
            </h5>
        </div>
        </div>
    </body>
    </html>

    `;
};

module.exports = { mailTemplate };
