module.exports = {
  apps: [
    {
      name: "tika",
      cwd: "/var/www/apps/tika",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3003",
        HOSTNAME: "127.0.0.1",
        DATABASE_URL: "file:/var/lib/2startup/tika/tika.db",
      },
    },
  ],
};
