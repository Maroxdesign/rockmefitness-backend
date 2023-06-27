export const Main = (content) => `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figur</title>
  </head>
  <style>
    * {
      padding: 0;
      margin: 0;
    }
  </style>
  <body
    style="
      background-color: #eff1f4;
      padding: 30px 0;
      margin: 0;
      font-family: sans-serif;
    "
  >
    <div style="width: 600px; margin: 0 auto; padding: 30px 0">
      <div style="margin: 15px 0">
        <img
          src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/logo-dark.png"
          alt="figur-logo"
          width="120"
        />
      </div>
      <div>
        <img
          src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/header.png"
          alt="figur-header-image"
          width="100%"
          style="border-radius: 10px 10px 0 0; object-fit: cover"
        />
      </div>

      <div
        style="
          background-color: white;
          padding: 40px 40px;
          color: #032b69;
          margin-top: -5px;
          border-radius: 0 0 10px 10px;
        "
      >
        ${content}
      </div>
      <div
        style="
          background-color: white;
          border-radius: 10px;
          padding: 35px 0;
          margin-top: 20px;
          text-align: center;
          color: #032b69;
        "
      >
        <h2 style="font-size: 20px; margin-top: 20px">Get Figur app!</h2>
        <p style="font-size: 14px; margin-top: 20px">
          Transforming the way people pay, work, play and live.
        </p>
        <div style="margin-top: 20px">
          <button style="background-color: transparent; border: none">
            <img
              src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/google-play.png"
              alt="play-store-button"
              height="40px"
            />
          </button>
          <button style="background-color: transparent; border: none">
            <img
              src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/app-store.png"
              alt="app-store-button"
              height="40px"
            />
          </button>
        </div>
      </div>
      <table
        style="
          width: 100%;
          max-width: 600px;
          margin: 15px 0;
          border-collapse: collapse;
          table-layout: fixed;
        "
      >
        <tr>
          <td style="padding: 0; width: 33.3%;">
            <img
              src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/logo-dark.png"
              alt="figur-logo"
              style="width: 80px"
            />
          </td>
          <td style="padding: 0; text-align: center;  width: 33.3%;">
            <div>
              <a href="#" style="text-decoration: none;">
                <img
                  src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/linkedin.png"
                  alt="linkedIn"
                  style="width: 15px; height: 15px; margin-right: 20px"
                />
              </a>
              <a href="#" style="text-decoration: none;">
                <img
                  src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/twitter.png"
                  alt="twitter"
                  style="width: 15px; height: 15px; margin-right: 20px"
                />
              </a>
              <a href="#" style="text-decoration: none;">
                <img
                  src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/facebook.png"
                  alt="facebook"
                  style="width: 15px; height: 15px; margin-right: 20px"
                />
              </a>
              <a href="#" style="text-decoration: none;">
                <img
                  src="https://figur.ams3.cdn.digitaloceanspaces.com/email_assets/instagram.png"
                  alt="instagram"
                  style="width: 15px; height: 15px"
                />
              </a>
            </div>
          </td>
          <td colspan="2" style="padding: 0; text-align: end;  width: 33.3%;">
            <p style="font-size: 12px; color: #032b69; margin: 0">
              Copyright &copy; 2022
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>

`;
