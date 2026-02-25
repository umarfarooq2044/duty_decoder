const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Check for connection string
const connectionString = 'postgresql://postgres.hflvxtyfmhrxapffuqib:umar8513umar@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

if (!connectionString) {
    console.error('Please provide a valid PostgreSQL connection string.');
    process.exit(1);
}

const sql = postgres(connectionString);

async function runMigrations() {
    const schemaDir = path.join(__dirname, 'schema');

    try {
        const files = fs.readdirSync(schemaDir)
            .filter(f => f.endsWith('.sql'))
            .sort(); // Ensure 001, 002, etc. order

        console.log(`Found ${files.length} migration files.`);

        for (const file of files) {
            console.log(`\n▶ Running ${file}...`);
            const filePath = path.join(schemaDir, file);
            const query = fs.readFileSync(filePath, 'utf8');

            try {
                await sql.unsafe(query);
                console.log(`✓ Successfully executed ${file}`);
            } catch (err) {
                console.error(`✗ Failed to execute ${file}:`, err.message);
                // We continue in case some tables exist, but log the error
            }
        }

        console.log('\n✨ Database migration completed!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sql.end();
    }
}

runMigrations();
