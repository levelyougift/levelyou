// LEVEL YOU V3 draft — source only, not deployed.
// Do not expose service role credentials in a browser.
import { createClient } from "jsr:@supabase/supabase-js@2";
const ORIGIN="https://levelyougift.github.io";
const enc=new TextEncoder();
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store","access-control-allow-origin":ORIGIN,"access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"content-type"}});
async function hash(value:string){const digest=await crypto.subtle.digest("SHA-256",enc.encode(value));return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function token(){const bytes=crypto.getRandomValues(new Uint8Array(32));return Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("")}
const isToken=(x:unknown):x is string=>typeof x==="string"&&/^[a-f0-9]{64}$/.test(x);
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return json({ok:true});
 if(req.method!=="POST")return json({error:"method_not_allowed"},405);
 // Draft deliberately READ-ONLY: no gift creation until authentication, abuse limits,
 // consent, retention and media upload policies are implemented.
 try{
 const body=await req.json();
 if(body?.action!=="open"||!isToken(body?.token))return json({error:"invalid_request"},400);
 const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!key)return json({error:"server_unavailable"},503);
 const db=createClient(url,key,{auth:{persistSession:false}});
 const {data,error}=await db.from("v3_gifts").select("status,recipient_name,memory_text,detail_text,dedication_text,feeling,expires_at,revoked_at").eq("access_token_hash",await hash(body.token)).maybeSingle();
 if(error)return json({error:"unavailable"},503);
 if(!data||data.status!=="ready"||data.revoked_at||new Date(data.expires_at).getTime()<=Date.now())return json({error:"not_available"},404);
 return json({recipientName:data.recipient_name,memory:data.memory_text,detail:data.detail_text,dedication:data.dedication_text,feeling:data.feeling});
 }catch{return json({error:"invalid_request"},400)}
});
