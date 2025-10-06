# Self hosted static site hosting

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

### NPM

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

### Deno

`deno run --allow-net jsr:@mudhost/cli <command> [options]`

#### Commands:
```bash
login <username> <password>
Authenticate and save token

deploy <project-id> [dist-dir] [branch] [commit]
Deploy a new preview (requires auth)

delete <deployment-id>
Delete a specific deployment (requires auth)

cleanup
Manually run cleanup of expired deployments (requires admin)

list
List all deployments (requires auth)

whoami
Show current user info

Options:
--api=<url>          API server URL (default: http://localhost:8000)
--username=<user>    Username for authentication
--password=<pass>    Password for authentication
--token=<token>      Direct token authentication

```

Examples:
```bash
deno run --allow-net jsr:@mudhost/cli login admin admin123
deno run --allow-net --allow-read jsr:@mudhost/cli deploy my-project ./dist
deno run --allow-net --allow-read jsr:@mudhost/cli deploy my-project --username=admin --password=admin123
deno run --allow-net jsr:@mudhost/cli list --api=https://hosting.example.com
```

