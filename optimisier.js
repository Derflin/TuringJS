function rangeStates(transit){
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