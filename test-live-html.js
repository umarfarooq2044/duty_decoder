const fs = require('fs');

const data = fs.readFileSync('live_test.txt', 'utf8');

const headStart = data.indexOf('<head>');
const headEnd = data.indexOf('</head>');
const titleLoc = data.indexOf('<title>');
const titleEnd = data.indexOf('</title>');
const bodyStart = data.indexOf('<body');
const bodyEnd = data.indexOf('</body>');

console.log("Stats layout from raw string matching:");
console.log("<head> starts at", headStart);
console.log("<head> ends at", headEnd, "length:", headEnd - headStart);
console.log("<title> starts at", titleLoc);
console.log("<title> content: ", data.substring(titleLoc, titleEnd + 8));
console.log("<body> starts at", bodyStart);

// Let's search for ALL <title> tags
let match;
let count = 0;
const regex = /<title[^>]*>(.*?)<\/title>/g;
while ((match = regex.exec(data)) !== null) {
    count++;
    console.log(`Title tag ${count} found at index ${match.index}. Inside head? ${match.index > headStart && match.index < headEnd}`);
    console.log(`Content: ${match[1]}`);
}
