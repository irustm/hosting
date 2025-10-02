const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

class ConfigManager {
    constructor() {
        this.configDir = path.join(os.homedir(), '.mudhost');
        this.configFile = path.join(this.configDir, 'config.json');
        this.ensureConfigDir();
    }

    ensureConfigDir() {
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true });
        }
    }

    async get(key) {
        try {
            const config = await this.getAll();
            return config[key];
        } catch (error) {
            return null;
        }
    }

    async getAll() {
        try {
            if (await fs.pathExists(this.configFile)) {
                return await fs.readJson(this.configFile);
            }
            return {};
        } catch (error) {
            return {};
        }
    }

    async set(key, value) {
        const config = await this.getAll();
        config[key] = value;
        await fs.writeJson(this.configFile, config, { spaces: 2 });
    }

    async clear() {
        if (await fs.pathExists(this.configFile)) {
            await fs.remove(this.configFile);
        }
    }

    createConfig() {
        const configTemplate = {
            apiUrl: 'http://localhost:8000',
            defaultProject: 'my-app',
            defaultBranch: 'main'
        };

        const configPath = path.join(process.cwd(), 'mudhost.json');

        if (fs.existsSync(configPath)) {
            console.log(chalk.yellow('⚠️ Config file already exists'));
            return;
        }

        fs.writeJsonSync(configPath, configTemplate, { spaces: 2 });
        console.log(chalk.green('✅ Created mudhost.json config file'));
    }
}

module.exports = { ConfigManager };