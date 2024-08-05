export const resetPassowrdTemplate = (email, url) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: rgba(30, 64, 175 , 1);
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            background: rgba(30, 64, 175 , 1);
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            color: #888888;
            font-size: 12px;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hi ${email},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${url}" class="button">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
            <p>Thanks,<br>The CHIT CHAT Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 CHIT CHAT. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
