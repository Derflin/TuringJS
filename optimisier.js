function restate(transit){
	let newtransit=[];
	let free=0;
	let mask=[]
/*
	let r=(state,char,effect)=>{
		mask[state]=newtransit.length;
		if(!newtransit[char]){
			newtransit[char]=[];
		}
		newtransit[char]=effect;
		delete transit[effect[0]][effect[1]];
	}
//*/
//*
	transit.forEach((chars,state)=>{
		newtransit[free]=chars;
		mask[state]=free;
		free++;
	});
	newtransit.forEach((chars,state)=>{
		chars.forEach((effect,char)=>{
			effect[0]=mask[effect[0]];
			transit[state]=newtransit[state];
		})			
	})
	transit.length=free;
//*/
}