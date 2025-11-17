<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Tools - Security Code</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        h1 {
            color: #2d3748;
            margin: 0;
        }
        .code-section {
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }
        .security-code {
            font-size: 32px;
            font-weight: bold;
            color: #2d3748;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 15px 25px;
            border-radius: 6px;
            display: inline-block;
            border: 1px solid #cbd5e0;
        }
        .warning {
            background: #fff5f5;
            border-left: 4px solid #f56565;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 6px 6px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #718096;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #4299e1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">AI</div>
            <h1>Security Verification</h1>
            <p>Hi {{ $user->name }},</p>
        </div>

        <p>Someone (hopefully you) is trying to sign in to your AI Tools Management account.</p>
        
        <p>To complete your login, please enter this security code:</p>

        <div class="code-section">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #4a5568;">Your Security Code</p>
            <div class="security-code">{{ $code }}</div>
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #718096;">
                This code expires in {{ $expires_in }}
            </p>
        </div>

        <div class="warning">
            <p style="margin: 0; font-weight: 600; color: #c53030;">
                🔒 Security Notice
            </p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
                If you didn't request this code, please ignore this email and secure your account immediately.
                Never share this code with anyone.
            </p>
        </div>

        <p>
            <strong>Login Details:</strong><br>
            • Time: {{ now()->format('M j, Y \a\t g:i A T') }}<br>
            • IP Address: {{ request()->ip() }}<br>
            • User Agent: {{ Str::limit(request()->userAgent(), 60) }}
        </p>

        <div class="footer">
            <p>
                <strong>AI Tools Management System</strong><br>
                This is an automated security email. Please do not reply.
            </p>
            <p>
                If you need help, contact your system administrator.
            </p>
        </div>
    </div>
</body>
</html>