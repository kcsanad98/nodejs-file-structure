const fs = require('fs');

process.stdin.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'));
})
