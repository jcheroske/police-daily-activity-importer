module.exports = {
  apps: [
    {
      name: 'police-daily-activity-importer',
      script: './dist/index.js',
      watch: './dist',
      env: {
        'NODE_ENV': 'development'
      },
      env_production: {
        'NODE_ENV': 'production'
      }
    }
  ]
}
