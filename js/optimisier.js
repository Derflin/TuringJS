/*
	kinds of states
	- initial state
		state 0
		state which Turing machine start
		!immovable
	- unrechable state
		state which never be used, because the path betwen the state and initial state doesn't exist
		!eraseable
		!shouldn't exist
	- misleading state
		state which doesn't exist, have no defined rules or all the next state are misleading
		!shouldn't exist
	- dead state
		state from which doesn't exist path to final state

	kinds of rules:
	- static rule
		rule which doesn't change position of Turing machine
	- final rule
		rule which doesn't change anything, and halt the Turing machine
	- misleading rule
		rule which point next state which doesn't exist
	
*/

function rangeStates(transit){
/*
	Delete gaps betewn states.
	New states have the same order but other number.
*/
	let newtransit=[];
	let free=0;
	let mask=[];
	let dbg=[]
	
	newtransit=[transit[0]];
	
	transit.forEach((chars,state)=>{
		newtransit[free]=chars;
		mask[state]=free;
		dbg[free]=state;
		free++;
	});
	newtransit.forEach((chars,state)=>{
		chars.forEach((effect,char)=>{
			effect[0]=mask[effect[0]]??free;
			transit[state]=newtransit[state];
		})			
	})
	transit.length=free;
	return dbg;
}
function removeUnreacableStates(transit){
/*
	Traverse states, start form state 0.
	Don't visited states are lost.
	States' numbers can change. 
*/
	let newtransit=[transit[0]];
	let free=1;
	let mask=[0];
	let dbg=[0]
	
	delete transit[0];
	for(let newstate=0;newstate<newtransit.length;++newstate){
		newtransit[newstate].forEach((effect,char)=>{
			let state=effect[0]
			if(transit[state]){
				newtransit[free]=transit[state];
				delete transit[state];
				mask[state]=free;
				dbg[free]=state;
				free++;
			}
		});
	}
	newtransit.forEach((chars,state)=>{
		chars.forEach((effect,char)=>{
			effect[0]=mask[effect[0]]??free;
			transit[state]=newtransit[state];
		})			
	})
	transit.length=free;
	return dbg;
}

function removeMisleading(transit){
/*
	Traverse tree. If some effect point state whitch doesn't exist is deleted. It's cascade operation.
*/
	let correctStates=[];
	removeMisleading.moveCorrectStates(transit,0,correctStates);
	let dbg=[]
	correctStates.forEach((chars,state)=>{
		transit[state]=chars;
	});
	return dbg;
}
removeMisleading.moveCorrectStates=(rulesSrc,state,rulesDst)=>{
/*
	Return information that state doesn't exist, or is missleading (all effects point to missleading or doesn't existang states).
	Deletes missleading states, left unrechable states, move correct states.
*/
	let chars=rulesSrc[state];
	if(chars){
		delete rulesSrc[state];
		rulesDst[state]=chars;
		let misleadingState=true;
		chars.forEach((effect,char)=>{
			let misleadingRule=removeMisleading.moveCorrectStates(rulesSrc,effect[0],rulesDst);
			misleadingState&&=misleadingRule;
			if(misleadingRule){
				delete rulesDst[state][char];
			}
		})
		if(!misleadingState){
			rulesDst[state]=chars;
			return false;
		}
		return true;
	}else{
		if(rulesDst[state]){
			return false;
		}
		return true;
	}
}



function applyCodeOptimisations(code,optimalisationList){
	let dbg=Array.from(code,(chars,state)=>state);
	optimalisationList.forEach((optimalisation)=>{
		let dbgOpt = optimalisation(code);
		for(let newly=0;newly<Math.max(dbgOpt.length,dbg.length);++newly){
			dbgOpt[newly]=dbg[dbgOpt[newly]??newly]
		}
		dbg=dbgOpt;
	});
	return dbg;
}