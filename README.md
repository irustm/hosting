# Static Site Hosting for Preview

## INSTRUCTION: Run on localhost

Quick start (one command):

```bash
docker run -d --name preview-hosting -p 80:80 jamaks/hosting:latest
```

### Login

```bash
# Via CLI inside the container
docker exec -it preview-hosting deno run -A cli/main.ts login admin

# Or via API
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD_FROM_LOGS"}'
```

---

### Prepare your project

```bash
mkdir -p ./my-project/dist
echo "<h1>Hello World!</h1>" > ./my-project/dist/index.html
```

### Deploy

```bash
docker exec -it preview-hosting deno run -A cli/main.ts deploy my-project ./my-project/dist
```

---

## INSTRUCTION: HTTPS setup for production server

Create a `Caddyfile`:

```text
your-domain.com {
    reverse_proxy localhost:80
}
```

Run:

```bash
docker run -d --name caddy -p 80:80 -p 443:443 -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile caddy
```
