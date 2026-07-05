export const buildOtpEmailHtml = (otp) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f7f3eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;margin-top:24px;">
    <tr>
      <td style="background:#3d7629;padding:24px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;">Krishik Bazar</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 24px;">
        <p style="margin:0 0 8px;color:#2c2419;font-size:16px;">Verify your email</p>
        <p style="margin:0 0 24px;color:#8a8175;font-size:14px;line-height:1.5;">
          Use this code to complete your registration. It expires in <strong>10 minutes</strong>.
        </p>
        <div style="background:#f3f9f0;border:2px dashed #72b454;border-radius:12px;padding:20px;text-align:center;">
          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#3d7629;">${otp}</span>
        </div>
        <p style="margin:24px 0 0;color:#8a8175;font-size:12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
