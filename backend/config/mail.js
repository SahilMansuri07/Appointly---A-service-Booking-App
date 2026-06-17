const createOtpWmailTemplate = ({ userName = "User", }) => {
  const appName = process.env.APP_NAME || "ServiceSlot Booking";
  const title = "Your Appoinment Status ";
  console.log("Generating OTP email template for user:", userName);
 
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${appName} OTP</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:20px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:10px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
          <tr>
            <td style="font-size:22px;font-weight:700;color:#0f172a;">${appName}</td>
          </tr>
          <tr>
            <td style="padding-top:8px;font-size:18px;font-weight:600;color:#111827;">${title}</td>
          </tr>
          <tr>
            <td style="padding-top:14px;font-size:14px;line-height:1.6;">
              Hello ${userName},<br />
             Your appointment has been  <strong>Booked</strong>. Thank you for using our service!
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
};
 
export { createOtpWmailTemplate };
 