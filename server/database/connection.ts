import knex, { Knex } from 'knex';
import knexfile from '../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config: Knex.Config = knexfile[environment];

const db = knex(config);

export default db;