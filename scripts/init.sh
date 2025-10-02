#!/bin/bash
set -e

DOMAIN=${DOMAIN:-localhost}
JWT_SECRET=${JWT_SECRET:-demo-secret-change-in-production}
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123}

echo "🚀 Deno Hosting starting..."
echo "📝 Domain: $DOMAIN"
echo "🔐 Admin: $ADMIN_USERNAME"
echo "🔑 Password: $ADMIN_PASSWORD"

mkdir -p /var/www/html
cat > /var/www/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Deno Hosting - $DOMAIN</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        code {
            background: rgba(0,0,0,0.3);
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            display: block;
            margin: 5px 0;
        }
        .endpoint {
            background: rgba(255,255,255,0.15);
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #4CAF50;
        }
        .success { color: #4CAF50; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Deno Hosting</h1>
        <p class="success">✅ Service is running successfully!</p>

        <div class="endpoint">
            <strong>Main Dashboard:</strong>
            <code>http://$DOMAIN</code>
        </div>

        <div class="endpoint">
            <strong>API Server:</strong>
            <code>http://$DOMAIN/api/</code>
        </div>

        <div class="endpoint">
            <strong>Preview URLs (Wildcard Subdomains):</strong><br>
            <code>http://{deployment-id}.$DOMAIN/</code><br>
            <small>Пример: <code>http://my-project-main-12345.$DOMAIN/</code></small>
        </div>

        <div class="endpoint">
            <strong>Alternative URLs:</strong><br>
            <code>http://$DOMAIN/deploy/{deployment-id}/</code><br>
            <code>http://$DOMAIN/{deployment-id}/</code>
        </div>

        <div class="endpoint">
            <strong>Admin Credentials:</strong><br>
            Username: <code>$ADMIN_USERNAME</code><br>
            Password: <code>$ADMIN_PASSWORD</code>
        </div>

        <h3>🔧 Quick Start:</h3>
        <ol>
            <li>Login with credentials above</li>
            <li>Deploy your project</li>
            <li>Access via: <code>http://{deployment-id}.$DOMAIN</code></li>
        </ol>

        <h3>🌐 DNS Setup:</h3>
        <p>For wildcard subdomains to work, configure DNS:</p>
        <code>*.your-domain.com A YOUR_SERVER_IP</code>
    </div>
</body>
</html>
EOF

echo "📁 Created dashboard page"

echo "🌐 Starting nginx..."
nginx

echo "🦕 Starting Deno application..."
deno run --allow-net --allow-read --allow-write --allow-env main.ts &

echo "✅ Deno Hosting started successfully!"
echo "📍 Dashboard: http://$DOMAIN"
echo "🔗 API: http://$DOMAIN/api/"
echo "🌐 Wildcard URLs: http://{deployment-id}.$DOMAIN"
echo "🔐 Admin: $ADMIN_USERNAME / $ADMIN_PASSWORD"

wait -n