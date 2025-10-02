# Static Site Hosting for Preview

## Quick start

```bash
docker run -d --name preview-hosting -e DOMAIN='localhost' -p 80:80 jamaks/hosting:latest
```

Change `DOMAIN` to your domain name. If you use `localhost`, you will need to add an entry to your `/etc/hosts`.

### Set DNS (if need)

```
*.example.com A YOUR_SERVER_IP
```


## CLI

### Login

// TODO CLI with npm

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