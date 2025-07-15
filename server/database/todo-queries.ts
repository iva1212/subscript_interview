import knex from './connection';

export async function all() {
    return knex('todos');
}

export async function get(id) {
    const results = await knex('todos').where({ id });
    return results[0];
}

export async function create(title, order) {
    const results = await knex('todos').insert({ title, order }).returning('*');
    return results[0];
}

export async function update(id, properties) {
    const results = await knex('todos').where({ id }).update({ ...properties }).returning('*');
    return results[0];
}

// delete is a reserved keyword
export async function del(id) {
    const results = await knex('todos').where({ id }).del().returning('*');
    return results[0];
}

export async function clear() {
    return knex('todos').del().returning('*');
}
