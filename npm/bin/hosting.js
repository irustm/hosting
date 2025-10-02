#!/usr/bin/env node

const { CLI } = require('../src/cli');

const cli = new CLI();
cli.run().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});