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

check_dependencies() {
    echo "🔍 Checking Deno dependencies..."
    if ! deno cache --no-lock main.ts 2>/dev/null; then
        echo "⚠️ Dependencies not fully cached, retrying..."
        sleep 2
        # Пытаемся кэшировать основные зависимости по отдельности
        deno cache --no-lock https://deno.land/x/oak@v12.6.1/mod.ts || true
        deno cache --no-lock https://deno.land/std@0.202.0/fs/mod.ts || true
        deno cache --no-lock https://deno.land/x/djwt@v2.9/mod.ts || true
    fi
    echo "✅ Dependencies ready"
}

mkdir -p /var/www/html
cat > /var/www/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Preview Hosting</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        code { background: #f4f4f4; padding: 10px; display: block; margin: 5px 0; }
    </style>
</head>
<body>
    <h1> Preview Hosting </h1>
    <p> Service is starting...</p>
    <p><strong>Admin:</strong> admin / admin123</p>
    <p><strong>URLs:</strong></p>
    <code>http://{deployment-id}.localhost/</code>
    <code>http://localhost/{deployment-id}/</code>
</body>
</html>
EOF

echo "📁 Created dashboard page"

check_dependencies

# Запускаем сервисы
echo "🌐 Starting nginx..."
nginx

echo "🦕 Starting Deno application..."
timeout 30s deno run --allow-net --allow-read --allow-write --allow-env main.ts || \
echo "⚠️ First start failed, retrying..." && \
deno run --allow-net --allow-read --allow-write --allow-env main.ts &

echo "✅ Deno Hosting started successfully!"
echo "📍 Access at: http://$DOMAIN"

wait -n