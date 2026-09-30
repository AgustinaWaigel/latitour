// Live integration test: two real test users, no service role needed.
// node --env-file=.env.local --env-file=.env.test.local scripts/test-rls.mjs
import { createClient } from '@supabase/supabase-js';
import assert from 'node:assert/strict';
const env=process.env;
for(const key of ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','TEST_OWNER_EMAIL','TEST_OWNER_PASSWORD','TEST_OTHER_EMAIL','TEST_OTHER_PASSWORD'])if(!env[key])throw new Error(`Missing ${key}`);
const make=()=>createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const owner=make(),other=make(),anon=make();
const a=await owner.auth.signInWithPassword({email:env.TEST_OWNER_EMAIL,password:env.TEST_OWNER_PASSWORD});
const b=await other.auth.signInWithPassword({email:env.TEST_OTHER_EMAIL,password:env.TEST_OTHER_PASSWORD});
assert.ifError(a.error);assert.ifError(b.error);assert.notEqual(a.data.user.id,b.data.user.id,'Use two different accounts');
let id;
try{
 const created=await owner.from('places').insert({owner_id:a.data.user.id,name:'RLS verification',description:'Temporary place for security verification.',category:'servicios',address:'Test address, Paraná',latitude:-31.73,longitude:-60.53,status:'closed'}).select().single();assert.ifError(created.error);id=created.data.id;
 const read=await anon.from('places').select('id').eq('id',id);assert.ifError(read.error);assert.equal(read.data.length,1);
 const foreignEdit=await other.from('places').update({name:'Unauthorized edit'}).eq('id',id).select();assert.ok(foreignEdit.error||foreignEdit.data.length===0);
 const foreignDelete=await other.from('places').delete().eq('id',id).select();assert.ok(foreignDelete.error||foreignDelete.data.length===0);
 const foreignInsert=await other.from('places').insert({owner_id:a.data.user.id,name:'Unauthorized insert',description:'This must be rejected by RLS.',category:'servicios',address:'Test address',latitude:-31.73,longitude:-60.53});assert.ok(foreignInsert.error);
 const transfer=await owner.from('places').update({owner_id:b.data.user.id}).eq('id',id).select();assert.ok(transfer.error||transfer.data.length===0);
 const anonymousEdit=await anon.from('places').update({name:'Anonymous edit'}).eq('id',id).select();assert.ok(anonymousEdit.error||anonymousEdit.data.length===0);
 const changed=await owner.from('places').update({status:'open',status_updated_at:'2099-01-01T00:00:00Z'}).eq('id',id).select().single();assert.ifError(changed.error);assert.ok(Math.abs(Date.parse(changed.data.status_updated_at)-Date.now())<60000,'Database must replace future timestamp');
 const publicResult=await anon.from('places').select('status,name').eq('id',id).single();assert.ifError(publicResult.error);assert.equal(publicResult.data.status,'open');assert.equal(publicResult.data.name,'RLS verification');
 console.log('PASS: public reads, owner updates, timestamp authority, foreign update/delete/insert and ownership transfer blocked.');
}finally{if(id){const cleanup=await owner.from('places').delete().eq('id',id);assert.ifError(cleanup.error);}await owner.auth.signOut();await other.auth.signOut();}