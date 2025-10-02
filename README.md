# Static Site Hosting for Preview

## Quick start

```bash
docker run -d --name preview-hosting -e DOMAIN='your-domain.com' -p 80:80 jamaks/hosting:latest
```

Change `DOMAIN` to your domain name.

If you use `localhost`, you will need to add an entry to your `/etc/hosts`.

### Set DNS (if need)

```
your-domain.com A YOUR_SERVER_IP
*.your-domain.com A YOUR_SERVER_IP
```


## CLI

#### Login to your Hosting instance:

```bash
npx mudhost login --api https://your-domain.com
```

Alternatively, you can provide username and password directly:
```
 mudhost login -u admin -p admin123 --api https://your-domain.com
```

#### Deploy your project:

```bash
npx mudhost deploy my-project ./dist
```

#### Access your preview:

```text
https://my-project-main-12345.your-domain.com
```

More about CLI Commands: [NPM](/npm)