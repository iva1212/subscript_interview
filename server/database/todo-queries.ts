import knex from './connection';

export async function all<T>(tableName: string): Promise<T[]> {
    return knex(tableName).select('*');
}

export async function get<T>(id:number, tableName: string): Promise<T> {
    const results = await knex(tableName).where({ id });
    return results[0];
}

export async function create<T>(entity:T, tableName: string): Promise<T> {
    const results = await knex(tableName).insert(entity).returning('*');
    return results[0];
}

export async function update<T>(id:number, properties:Partial<T>,tableName:string): Promise<T> {
    const results = await knex(tableName).where({ id }).update({ ...properties }).returning('*');
    return results[0];
}

// delete is a reserved keyword
export async function del<T>(id:number,tableName:string): Promise<T> {
    const results = await knex(tableName).where({ id }).del().returning('*');
    return results[0];
}

export async function clear<T>(tableName:string): Promise<T[]> {
    return knex(tableName).del().returning('*');
}
