module.exports = {
    apps: [
        {
            name: 'padel-mixer',
            script: 'npm',
            args: 'run start',
            cwd: '/path/to/Padel-Mixer',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3131
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true
        }
    ]
};
