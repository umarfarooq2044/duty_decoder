import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const dirs = ['src', 'schema', '.'];
const exts = ['.ts', '.tsx', '.sql', '.md', '.json', '.env.local', '.env.example'];

function findFiles(dir) {
    let results = [];
    for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry === '.next' || entry === '.git') continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            results.push(...findFiles(full));
        } else {
            if (exts.some(ext => full.endsWith(ext) || entry === ext)) {
                results.push(full);
            }
        }
    }
    return results;
}

let modified = 0;
for (const d of dirs) {
    if (d === '.' || statSync(d).isDirectory()) {
        const files = d === '.' ? readdirSync('.').filter(f => !statSync(f).isDirectory() && exts.some(e => f.endsWith(e) || f === e)) : findFiles(d);
        for (const file of files) {
            const original = readFileSync(file, 'utf8');
            let content = original;

            content = content.replace(/GlobalTrade Decoder/g, 'Duty Decoder');
            content = content.replace(/globaltrade-decoder/g, 'duty-decoder');
            content = content.replace(/GlobalTradeDecoder/g, 'DutyDecoder');
            content = content.replace(/GlobalTrade/g, 'Duty Decoder');

            if (content !== original) {
                writeFileSync(file, content, 'utf8');
                modified++;
                console.log('Updated:', file);
            }
        }
    }
}
console.log(`Updated ${modified} files.`);
