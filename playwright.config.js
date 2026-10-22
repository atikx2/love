const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:3000', ...(process.env.CHROMIUM_PATH ? {launchOptions: {executablePath:process.env.CHROMIUM_PATH, args:require('@sparticuz/chromium').default.args.filter(arg => arg !== '--single-process')}} : {}) },
  webServer: { command: 'npm start', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI },
  projects: [
    {name:'mobile', use:{browserName:'chromium', viewport:{width:390,height:844}, isMobile:true, hasTouch:true}},
    {name:'desktop', use:{browserName:'chromium', viewport:{width:1440,height:1000}}}
  ]
});
