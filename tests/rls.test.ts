import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
test('PostgreSQL RLS isolates owners and public queries see committed state changes', async () => {
  const db = new PGlite();
  const a = '10000000-0000-4000-8000-000000000001',
    b = '10000000-0000-4000-8000-000000000002';
  try {
    await db.exec(
      `create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); insert into auth.users values ('${a}'),('${b}'); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema public,auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`,
    );
    await db.exec(readFileSync('supabase/schema.sql', 'utf8'));
    await db.exec(readFileSync('supabase/seed.sql', 'utf8'));
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${a}',false);`,
    );
    const inserted = await db.query<{ id: string }>(
      `insert into places(owner_id,name,description,category,address,latitude,longitude,status) values ('${a}','Security test','Temporary security verification place.','servicios','Paraná test',-31.73,-60.53,'closed') returning id`,
    );
    const id = inserted.rows[0].id;
    await db.exec(`select set_config('request.jwt.claim.sub','${b}',false);`);
    assert.equal(
      (
        await db.query('update places set name=$1 where id=$2 returning id', [
          'Not allowed',
          id,
        ])
      ).rows.length,
      0,
    );
    assert.equal(
      (await db.query('delete from places where id=$1 returning id', [id])).rows
        .length,
      0,
    );
    await assert.rejects(
      db.query(
        `insert into places(owner_id,name,description,category,address,latitude,longitude) values ($1,'Invalid insert','This foreign insert must be rejected.','servicios','Test address',-31.73,-60.53)`,
        [a],
      ),
      /row-level security/,
    );
    await db.exec(`select set_config('request.jwt.claim.sub','${a}',false);`);
    await assert.rejects(
      db.query('update places set owner_id=$1 where id=$2', [b, id]),
      /row-level security/,
    );
    const old = await db.query<{ status_updated_at: Date }>(
      'select status_updated_at from places where id=$1',
      [id],
    );
    await db.query('update places set description=$1 where id=$2', [
      'Updated description, same state confirmation.',
      id,
    ]);
    const same = await db.query<{ status_updated_at: Date }>(
      'select status_updated_at from places where id=$1',
      [id],
    );
    assert.equal(
      String(old.rows[0].status_updated_at),
      String(same.rows[0].status_updated_at),
    );
    await db.query(
      "update places set status='open',status_updated_at='2099-01-01' where id=$1",
      [id],
    );
    await db.exec(
      "reset role; set role anon; select set_config('request.jwt.claim.sub','',false);",
    );
    const result = await db.query<{
      status: string;
      status_updated_at: Date;
      name: string;
    }>('select status,status_updated_at,name from places where id=$1', [id]);
    assert.equal(result.rows[0].status, 'open');
    assert.equal(result.rows[0].name, 'Security test');
    assert.ok(
      Math.abs(
        new Date(result.rows[0].status_updated_at).getTime() - Date.now(),
      ) < 60000,
    );
    await assert.rejects(
      db.query("update places set status='closed' where id=$1", [id]),
      /permission denied/,
    );
    const expired = await db.query<{ count: number }>(
      "select count(*)::int as count from places where is_demo and status='open' and status_updated_at >= now() - interval '24 hours'",
    );
    assert.equal(expired.rows[0].count, 8);
  } finally {
    await db.close();
  }
});
