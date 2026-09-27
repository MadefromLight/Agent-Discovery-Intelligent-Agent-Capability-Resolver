export interface AgentCard {id:string;name:string;capabilities:string[];protocols?:string[];trust?:number;metadata?:Record<string,unknown>;}
export interface Query {capability:string;protocol?:string;minTrust?:number;}
export interface Match {agent:AgentCard;score:number;reasons:string[];}
export function resolve(query:Query,candidates:AgentCard[]):Match[]{
 return candidates.map(agent=>{let score=0;const reasons:string[]=[];
 const exact=agent.capabilities.some(c=>c.toLowerCase()===query.capability.toLowerCase());
 if(exact){score+=60;reasons.push("capability match");}
 else if(agent.capabilities.some(c=>c.toLowerCase().includes(query.capability.toLowerCase()))){score+=30;reasons.push("partial capability");}
 if(query.protocol && agent.protocols?.includes(query.protocol)){score+=25;reasons.push("protocol compatible");}
 if((agent.trust??0)>=(query.minTrust??0)){score+=15;reasons.push("trust threshold");} else score=-1;
 return {agent,score,reasons};}).filter(x=>x.score>=0).sort((a,b)=>b.score-a.score);
}