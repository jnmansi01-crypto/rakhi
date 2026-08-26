const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewport({ width: 390, height: 844 });
  
  // Go to template 01 demo
  await page.goto('http://localhost:3000/gift/demo?template=template-01&sound=off', { waitUntil: 'networkidle2' });
  
  // Take screenshot of Scene 1
  await page.screenshot({ path: '/tmp/tpl1_scene1.png' });
  
  // Click next button if exists
  try {
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/tpl1_scene2.png' });
  } catch(e) {
    console.log("Could not click next");
  }

  await browser.close();
  console.log("Screenshots captured at /tmp/tpl1_scene1.png and /tmp/tpl1_scene2.png");
})();
