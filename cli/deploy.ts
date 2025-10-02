import { walk } from "https://deno.land/std@0.202.0/fs/walk.ts";
import { join, relative } from "https://deno.land/std@0.202.0/path/mod.ts";
import { AuthManager } from "./auth.ts";

interface DeployConfig {
    projectId: string;
    branch: string;
    commit: string;
    distDir: string;
    apiUrl: string;
    username?: string;
    password?: string;
    token?: string;
}

async function collectFiles(dir: string): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    try {
        console.log(`📁 Scanning directory: ${dir}`);

        for await (const entry of walk(dir)) {
            if (entry.isFile) {
                const relativePath = relative(dir, entry.path).replace(/\\/g, '/');

                try {
                    const content = await Deno.readTextFile(entry.path);
                    files[relativePath] = content;
                } catch (error) {
                    console.error(`  ❌ Error reading ${relativePath}:`, error);
                }
            }
        }

        console.log(`✅ Total files collected: ${Object.keys(files).length}`);
    } catch (error) {
        console.error(`❌ Error scanning directory ${dir}:`, error);
        throw error;
    }

    return files;
}

export async function deploy(config: DeployConfig) {
    try {
        const auth = new AuthManager(config);
        await auth.ensureAuth(config.username, config.password);

        console.log(`📦 Deploying ${config.projectId}...`);
        console.log(`📍 Source: ${config.distDir}`);

        const files = await collectFiles(config.distDir);

        if (Object.keys(files).length === 0) {
            throw new Error(`No files found in ${config.distDir}`);
        }

        console.log(`🚀 Sending deployment to ${config.apiUrl}...`);

        const response = await fetch(`${config.apiUrl}/api/deployments`, {
            method: 'POST',
            headers: auth.getAuthHeaders(),
            body: JSON.stringify({
                projectId: config.projectId,
                branch: config.branch || "main",
                commit: config.commit || "latest",
                files
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const deployment = await response.json();
        console.log(`✅ Deployment successful!`);
        console.log(`🔗 Preview URL: ${deployment.url}`);
        console.log(`📊 Files deployed: ${deployment.files.length}`);

        return deployment;
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        Deno.exit(1);
    }
}