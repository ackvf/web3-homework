import { kv } from '@vercel/kv'

import { sleepResolve, str2hash } from '../utils'

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @description
 * This is a simple DEMO Redis JSON database for storing User records.\
 *
 * 👉 **Vercel KV Database CLI**
 * - https://vercel.com/qwerty-xyz/exodus-homework/stores/kv/store_biBYc1sEJQu6AxyB/cli
 *
 * Making a fetch request directly without ENV variables
 * - https://vercel.com/docs/storage/vercel-kv/rest-api#making-a-request-without-environment-variables
 * - Rest API reference: https://vercel.com/docs/storage/vercel-kv/rest-api
 *
 * @description
 *
 * Redis playground
 * - https://try.redis.io/
 *
 * Redis sets and hashes to store User records.
 * - https://redis.io/docs/data-types/sets/
 * - https://redis.io/docs/data-types/hashes/
 *
 *
 * Useful commands:
 *
 * - `KEYS *` to list all keys
 * - `DEL key1 [key2 ...]` to delete keys
 * - `HGETALL key` to get all fields and values of a hashmap
 * - `SMEMBERS key` to get all members of a set
 * - `SISMEMBER key fid` to check if user's fid is in a set
 *
 * - `HSET key field1 value1 [field2 value2 ...]` to set specific field value of a hashmap
 * - `HGET key field1` to get specific field value of a hashmap
 * - `HMGET key field1 [field2 ...]` to get specific fields values of a hashmap
 * - `HDEL key field1 [field2 ...]` to remove specific fields of a hashmap
 *
 * - `SADD key fid1 [fid2 ...]` to add user's fid to a set
 * - `SREM key fid1 [fid2 ...]` to remove user's fid from a set
 */

/** As stored in the db. */
export interface RedisRawUser {
  name: string
  email: string
  /** A hashed password */
  password: number
}

/** Data returned from the query after removing sensitive fields. */
export interface RedisUser extends Omit<RedisRawUser, 'password'> {
  name: string
  email: string
}

/** Submitted from the form. */
export interface UserFormPayload extends RedisUser {
  password: string
}

/**
 * Used to generate consistent Hashmap keys for the database.
 */
function hashKey({ email }: Pick<UserFormPayload, 'email'>) {
  return `hash:user:${email}` as const
}

/**
 * Used to generate consistent Set keys for the database.
 */
function setKey({ email }: Pick<UserFormPayload, 'email'>) {
  return `set:user:${email}` as const
}

/**
 * Test the connection to the Redis database.
 */
export async function ping(message?: string): Promise<string> {
  return kv.ping([message])
}

/**
 * Adds a user record to the database.
 *
 * - Creates new User record as a hashmap. e.g.:
 *    - `HSET hash:user:jsmith@example.com email <..> name <..> password <..>`
 */
export async function add({ email, name, password }: UserFormPayload) {
  const hset = kv.hset(hashKey({ email }), {
    email,
    name,
    password: str2hash(password),
  } satisfies RedisRawUser)
  return Promise.allSettled([hset])
}

/**
 * Reads a User record from the database, removing sensitive fields.
 */
export async function get({ email }: Pick<UserFormPayload, 'email'>): Promise<RedisUser | null> {
  //@ts-expect-error https://github.com/upstash/upstash-redis/issues/886
  const record = await kv.hgetall<RedisRawUser>(hashKey({ email }))
  if (record) {
    const { password, ...data } = record
    return data
  }
  return null
}

/**
 * Verifies a Form password with the hashed password in database.
 */
export async function verifyPassword({
  email,
  password,
}: Pick<UserFormPayload, 'email' | 'password'>): Promise<boolean> {
  await sleepResolve(Math.random() * 500)
  return (await kv.hget<RedisRawUser['password']>(hashKey({ email }), 'password')) === str2hash(password)
}

/**
 * Removes a User record from the database.
 */
export async function remove({ email }: Pick<UserFormPayload, 'email'>) {
  const hset = kv.del(hashKey({ email }))
  return Promise.allSettled([hset])
}
