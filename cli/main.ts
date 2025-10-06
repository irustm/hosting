import { deploy } from "./deploy.ts";
import { deleteDeployment } from "./delete.ts";
import { runCleanup } from "./cleanup.ts";
import { AuthManager } from "./auth.ts";

/**
 * Main CLI entry point to mudhost hosting service.
 */
async function main() {
    const args = Deno.args;
    const command = args[0];

    const apiUrl = args.find(arg => arg.startsWith('--api='))?.split('=')[1] || "http://localhost:8000";
    const username = args.find(arg => arg.startsWith('--username='))?.split('=')[1];
    const password = args.find(arg => arg.startsWith('--password='))?.split('=')[1];
    const token = args.find(arg => arg.startsWith('--token='))?.split('=')[1];

    const authConfig = { apiUrl, username, password, token };

    switch (command) {
        case "login": {
            const auth = new AuthManager(authConfig);
            const loginUsername = args[1] || username;
            const loginPassword = args[2] || password;

            if (!loginUsername || !loginPassword) {
                console.error("❌ Username and password required");
                console.log("Usage: login <username> <password>");
                Deno.exit(1);
            }

            const success = await auth.login(loginUsername, loginPassword);
            if (!success) {
                console.error("❌ Login failed");
                Deno.exit(1);
            }
            break;
        }

        case "deploy": {
            const projectId = args[1];
            const distDir = args[2] || "./dist";
            const branch = args[3] || "main";
            const commit = args[4] || "latest";

            if (!projectId) {
                console.error("❌ Project ID is required");
                console.log("Usage: deploy <project-id> [dist-dir] [branch] [commit]");
                Deno.exit(1);
            }

            await deploy({ ...authConfig, projectId, distDir, branch, commit });
            break;
        }

        case "delete": {
            const deploymentId = args[1];
            await deleteDeployment({ ...authConfig, deploymentId });
            break;
        }

        case "cleanup": {
            await runCleanup(authConfig);
            break;
        }

        case "list": {
            await listDeployments(authConfig);
            break;
        }

        case "whoami": {
            await whoami(authConfig);
            break;
        }

        default:
            console.log(`
🚀 Hosting CLI

Commands:
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

Examples:
  deno run --allow-net jsr:@mudhost/cli login admin admin123
  deno run --allow-net --allow-read jsr:@mudhost/cli deploy my-project ./dist
  deno run --allow-net --allow-read jsr:@mudhost/cli deploy my-project --username=admin --password=admin123
  deno run --allow-net jsr:@mudhost/cli list --api=https://hosting.example.com
      `);
    }
}

async function whoami(config: any) {
    try {
        const auth = new AuthManager(config);
        await auth.ensureAuth();

        const response = await fetch(`${config.apiUrl}/api/auth/me`, {
            headers: auth.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const userInfo = await response.json();
        console.log(`👤 Current user: ${userInfo.user.username}`);
        console.log(`🎯 Role: ${userInfo.user.role}`);

    } catch (error) {
        console.error('❌ Failed to get user info:', error);
        Deno.exit(1);
    }
}

// Функция для списка деплоев
async function listDeployments(config: { apiUrl: string }) {
    try {
        const response = await fetch(`${config.apiUrl}/api/deployments`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const deployments = await response.json();

        console.log("📋 Deployments:");
        console.log("=" .repeat(80));

        deployments.forEach((deployment: any) => {
            const status = deployment.isExpired ? "❌ EXPIRED" : "✅ ACTIVE";
            const daysLeft = deployment.isExpired ?
                "EXPIRED" :
                `${Math.ceil(deployment.expiresIn / (1000 * 60 * 60 * 24))} days`;

            console.log(`🆔 ${deployment.id}`);
            console.log(`   📁 Project: ${deployment.projectId}`);
            console.log(`   🌿 Branch: ${deployment.branch}`);
            console.log(`   🔗 URL: ${deployment.url}`);
            console.log(`   📅 Created: ${deployment.createdAt}`);
            console.log(`   ⏰ Status: ${status} (${daysLeft} left)`);
            console.log(`   📊 Files: ${deployment.files.length}`);
            console.log("-".repeat(80));
        });

    } catch (error) {
        console.error('❌ List failed:', error);
        Deno.exit(1);
    }
}

if (import.meta.main) {
    main();
}