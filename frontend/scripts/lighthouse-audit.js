#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Lighthouse CLI is installed
function checkLighthouse() {
  try {
    execSync('lighthouse --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install Lighthouse CLI if not present
function installLighthouse() {
  console.log('Installing Lighthouse CLI...');
  try {
    execSync('npm install -g lighthouse', { stdio: 'inherit' });
    console.log('Lighthouse CLI installed successfully!');
    return true;
  } catch (error) {
    console.error('Failed to install Lighthouse CLI:', error.message);
    return false;
  }
}

// Run Lighthouse audit
function runLighthouseAudit(url, outputPath) {
  const command = `lighthouse ${url} --output=json --output-path=${outputPath} --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --only-categories=performance,accessibility,best-practices,seo`;
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Lighthouse audit failed for ${url}:`, error.message);
    return false;
  }
}

// Parse Lighthouse results
function parseResults(outputPath) {
  try {
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const scores = {
      performance: Math.round(data.categories.performance.score * 100),
      accessibility: Math.round(data.categories.accessibility.score * 100),
      bestPractices: Math.round(data.categories['best-practices'].score * 100),
      seo: Math.round(data.categories.seo.score * 100)
    };
    
    const metrics = {
      fcp: data.audits['first-contentful-paint']?.numericValue,
      lcp: data.audits['largest-contentful-paint']?.numericValue,
      fid: data.audits['max-potential-fid']?.numericValue,
      cls: data.audits['cumulative-layout-shift']?.numericValue,
      ttfb: data.audits['server-response-time']?.numericValue
    };
    
    return { scores, metrics };
  } catch (error) {
    console.error('Failed to parse Lighthouse results:', error.message);
    return null;
  }
}

// Main function
async function main() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const outputDir = path.join(__dirname, '../lighthouse-reports');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Check/install Lighthouse
  if (!checkLighthouse()) {
    if (!installLighthouse()) {
      process.exit(1);
    }
  }
  
  console.log('🚀 Starting Lighthouse Performance Audit...\n');
  
  // Test URLs
  const testUrls = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About Page' },
    { path: '/services', name: 'Services Page' },
    { path: '/contact', name: 'Contact Page' },
    { path: '/work', name: 'Work Page' }
  ];
  
  const results = [];
  
  for (const test of testUrls) {
    const url = `${baseUrl}${test.path}`;
    const outputPath = path.join(outputDir, `${test.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    
    console.log(`📊 Auditing ${test.name} (${url})...`);
    
    if (runLighthouseAudit(url, outputPath)) {
      const result = parseResults(outputPath);
      if (result) {
        results.push({
          page: test.name,
          url: url,
          ...result
        });
        
        console.log(`✅ ${test.name} - Performance: ${result.scores.performance}/100`);
        console.log(`   Accessibility: ${result.scores.accessibility}/100`);
        console.log(`   Best Practices: ${result.scores.bestPractices}/100`);
        console.log(`   SEO: ${result.scores.seo}/100\n`);
      }
    }
  }
  
  // Generate summary report
  if (results.length > 0) {
    const summaryPath = path.join(outputDir, 'summary.md');
    const summary = generateSummaryReport(results);
    fs.writeFileSync(summaryPath, summary);
    
    console.log('📋 Performance Summary:');
    console.log('=======================');
    
    results.forEach(result => {
      const avgScore = Math.round((result.scores.performance + result.scores.accessibility + result.scores.bestPractices + result.scores.seo) / 4);
      console.log(`${result.page}: ${avgScore}/100 (P:${result.scores.performance}, A:${result.scores.accessibility}, BP:${result.scores.bestPractices}, SEO:${result.scores.seo})`);
    });
    
    console.log(`\n📄 Detailed reports saved to: ${outputDir}`);
    console.log(`📋 Summary report: ${summaryPath}`);
  }
}

// Generate summary report
function generateSummaryReport(results) {
  let report = '# Lighthouse Performance Audit Summary\n\n';
  report += `Generated on: ${new Date().toISOString()}\n\n`;
  
  results.forEach(result => {
    report += `## ${result.page}\n`;
    report += `- **URL**: ${result.url}\n`;
    report += `- **Performance**: ${result.scores.performance}/100\n`;
    report += `- **Accessibility**: ${result.scores.accessibility}/100\n`;
    report += `- **Best Practices**: ${result.scores.bestPractices}/100\n`;
    report += `- **SEO**: ${result.scores.seo}/100\n\n`;
    
    if (result.metrics) {
      report += '### Core Web Vitals\n';
      report += `- **FCP**: ${result.metrics.fcp ? Math.round(result.metrics.fcp) + 'ms' : 'N/A'}\n`;
      report += `- **LCP**: ${result.metrics.lcp ? Math.round(result.metrics.lcp) + 'ms' : 'N/A'}\n`;
      report += `- **FID**: ${result.metrics.fid ? Math.round(result.metrics.fid) + 'ms' : 'N/A'}\n`;
      report += `- **CLS**: ${result.metrics.cls ? result.metrics.cls.toFixed(3) : 'N/A'}\n`;
      report += `- **TTFB**: ${result.metrics.ttfb ? Math.round(result.metrics.ttfb) + 'ms' : 'N/A'}\n\n`;
    }
  });
  
  return report;
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runLighthouseAudit, parseResults };
