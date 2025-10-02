## Quick Start

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

## Commands

Login
```bashz
npx mudhost login [options]
```
Deploy

```bash
npx mudhost deploy <project-id> [dist-dir] [options]
```
List Deployments
```bash
npx mudhost list [options]
```

Delete Deployment

```bash
npx mudhost delete <deployment-id>
```
Whoami

```bash
npx mudhost whoami
```

Logout
```bash
npx mudhost logout
```


### Examples

```bash
# Deploy with custom branch
npx mudhost deploy my-app ./build --branch feature/new-ui

# Deploy to custom API
npx mudhost deploy my-app ./dist --api https://staging.example.com

# List deployments for a project
npx mudhost list --project my-app
```


## Configuration

The CLI automatically saves your authentication token and API URL in ~/.mudhost/config.json.

You can also create a mudhost.json file in your project:

```json
{
"apiUrl": "https://your-domain.com",
"defaultProject": "my-app",
"defaultBranch": "main"
}
```