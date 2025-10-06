interface DeleteConfig {
    deploymentId: string;
    apiUrl: string;
}

export async function deleteDeployment(config: DeleteConfig) {
    try {
        console.log(`🗑️ Deleting deployment: ${config.deploymentId}`);

        const response = await fetch(`${config.apiUrl}/api/deployments/${config.deploymentId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ ${result.message}`);

        return result;
    } catch (error) {
        console.error('❌ Delete failed:', error);
        Deno.exit(1);
    }
}