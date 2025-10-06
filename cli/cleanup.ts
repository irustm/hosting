interface CleanupConfig {
    apiUrl: string;
}

export async function runCleanup(config: CleanupConfig) {
    try {
        console.log("🧹 Running cleanup...");

        const response = await fetch(`${config.apiUrl}/api/cleanup`, {
            method: 'POST',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ ${result.message}`);
        console.log(`📊 Deployments deleted: ${result.deleted}`);

        if (result.errors.length > 0) {
            console.log("❌ Errors:");
            result.errors.forEach((error: string) => console.log(`  - ${error}`));
        }

        return result;
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        Deno.exit(1);
    }
}