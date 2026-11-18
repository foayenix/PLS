import { readFile, writeFile } from 'node:fs/promises';

const databaseId = process.env.FIELDWORK_D1_DATABASE_ID;
const teamDomain = process.env.FIELDWORK_ACCESS_TEAM_DOMAIN;
const audience = process.env.FIELDWORK_ACCESS_AUD;
const workerName = process.env.FIELDWORK_WORKER_NAME || 'fieldwork';
const databaseName = process.env.FIELDWORK_D1_DATABASE_NAME || 'fieldwork';
const dryRun = process.argv.includes('--dry-run');

if (!databaseId || !/^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(databaseId)
  || !teamDomain || !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(teamDomain)
  || !audience || !/^[a-f\d]{64}$/i.test(audience)
  || !/^[a-z0-9][a-z0-9-]{0,58}$/.test(workerName)
  || !/^[a-z0-9][a-z0-9_-]{0,62}$/i.test(databaseName)) {
  throw new Error('Set FIELDWORK_D1_DATABASE_ID, FIELDWORK_ACCESS_TEAM_DOMAIN and FIELDWORK_ACCESS_AUD to the values from your Cloudflare account.');
}

const build = new URL('../dist/server/wrangler.json', import.meta.url);
const config = JSON.parse(await readFile(build, 'utf8'));
const database = config.d1_databases?.find(item => item.binding === 'DB');
if (!database) throw new Error('The build does not contain the DB binding. Run the project build first.');
database.database_name = databaseName;
database.database_id = databaseId;
database.migrations_dir = '../../drizzle';
config.name = config.topLevelName = workerName;
config.workers_dev = true;
config.preview_urls = false;
config.vars = {
  ...config.vars,
  FIELDWORK_HOST: 'cloudflare',
  FIELDWORK_ACCESS_TEAM_DOMAIN: teamDomain,
  FIELDWORK_ACCESS_AUD: audience,
};
if (!dryRun) await writeFile(new URL('wrangler.cloudflare.json', build), JSON.stringify(config, null, 2) + '\n');
console.log(dryRun ? 'Worker configuration passed.' : 'Created dist/server/wrangler.cloudflare.json');
