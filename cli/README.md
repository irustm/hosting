### Login
deno run -A cli/main.ts login admin admin123

### Deploy the project (uses saved token)
deno run -A cli/main.ts deploy my-project ./dist

### Deploy with direct credentials
deno run -A cli/main.ts deploy my-project --username=admin --password=admin123

### View current user
deno run -A cli/main.ts whoami

### List of deploys
deno run -A cli/main.ts list
