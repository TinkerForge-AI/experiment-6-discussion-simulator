// Dashboard output for discussion simulator
const fs = require('fs');

function showMetrics(metrics) {
  console.log('--- Real-Time Metrics ---');
  console.log('API Calls:', metrics.apiCalls);
  console.log('Consensus Points:', metrics.consensusPoints);
  console.log('Divergence Points:', metrics.divergencePoints);
  console.log('Token Usage:');
  for (const persona in metrics.tokenUsage) {
    const usage = metrics.tokenUsage[persona].map(u => u.tokens).reduce((a, b) => a + b, 0);
    console.log(`  ${persona}: ${usage}`);
  }
  if (metrics.warnings && metrics.warnings.length) {
    console.log('Warnings:');
    metrics.warnings.forEach(w => console.log('  ' + w));
  }
}

function showConsensusBar(consensusScore) {
  // ASCII bar chart for consensus strength
  const barLength = Math.round(consensusScore * 20);
  const bar = '='.repeat(barLength) + ' '.repeat(20 - barLength);
  console.log(`Consensus Strength: [${bar}] (${Math.round(consensusScore * 100)}%)`);
}

function showParticipation(personas, metrics) {
  // Participation balance across personas
  console.log('Participation Balance:');
  personas.forEach(p => {
    const count = metrics.tokenUsage[p.id] ? metrics.tokenUsage[p.id].length : 0;
    console.log(`  ${p.name}: ${count} responses`);
  });
}

function exportMetrics(metrics, format = 'json', filePath = 'session_metrics.json') {
  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2));
  } else if (format === 'csv') {
    // Simple CSV export for token usage
    let csv = 'persona,round,tokens\n';
    for (const persona in metrics.tokenUsage) {
      metrics.tokenUsage[persona].forEach(u => {
        csv += `${persona},${u.round || ''},${u.tokens}\n`;
      });
    }
    fs.writeFileSync(filePath, csv);
  }
  console.log(`Metrics exported to ${filePath}`);
}

module.exports = {
  showMetrics,
  showConsensusBar,
  showParticipation,
  exportMetrics
};
