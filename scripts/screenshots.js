const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshots() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });

    const page = await browser.newPage();
    
    // Navigate to the local server
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
    
    // Create screenshots directory if it doesn't exist
    const fs = require('fs');
    const screenshotsDir = path.join(__dirname, '../screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Define viewport sizes
    const viewports = {
        desktop: { width: 1920, height: 1080 },
        mobile: { width: 390, height: 844 }
    };

    // Define pages to capture
    const pages = ['home', 'about', 'contact'];

    for (const [device, viewport] of Object.entries(viewports)) {
        console.log(`\n📱 Capturing ${device} screenshots...`);
        
        await page.setViewport(viewport);
        
        // For mobile, capture home page immediately after viewport change
        if (device === 'mobile') {
            try {
                // Make sure we're on the home page first
                await page.click('[data-page="home"]');
                await new Promise(resolve => setTimeout(resolve, 300));
                const screenshotPath = path.join(screenshotsDir, `home-${device}.png`);
                await page.screenshot({
                    path: screenshotPath,
                    fullPage: true
                });
                console.log(`✅ home-${device}.png captured`);
            } catch (error) {
                console.error(`❌ Error capturing home-${device}:`, error.message);
            }
        }
        
        for (const pageName of pages) {
            // Skip home page for mobile since we already captured it
            if (device === 'mobile' && pageName === 'home') continue;
            
            try {
                // Navigate to the specific page
                if (pageName !== 'home') {
                    await page.click(`[data-page="${pageName}"]`);
                    // Wait for page transition
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                // Wait for content to load
                await page.waitForSelector('.page[data-page="' + pageName + '"]', { visible: true });
                
                // Take screenshot
                const screenshotPath = path.join(screenshotsDir, `${pageName}-${device}.png`);
                await page.screenshot({
                    path: screenshotPath,
                    fullPage: true
                });
                
                console.log(`✅ ${pageName}-${device}.png captured`);
                
            } catch (error) {
                console.error(`❌ Error capturing ${pageName}-${device}:`, error.message);
            }
        }
    }

    await browser.close();
    console.log('\n🎉 All screenshots captured successfully!');
    console.log('📁 Check the screenshots folder for results.');
}

// Run the screenshot capture
captureScreenshots().catch(console.error);
