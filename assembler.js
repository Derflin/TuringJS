class assembler{
	constructor(AST){
		this.AST=AST;
	}
	assembly(){
		console.time("assembling");
		let code=[];
		let rule;
		let rules=0n;
		let maxstate=0n;
		let maxchar=0n;
		for(rule of this.AST.getGenerator(AST.symbols)){
			if(code[rule.state]==undefined){
				code[rule.state]=[];
			}
			if(code[rule.state][rule.chr]!= undefined)
				throw "redefinition"
			code[rule.state][rule.chr]=[rule.newchar,String.fromCharCode(Number(rule.newstate)),rule.move.map((step)=>Number(step))];
			++rules;
			
			if(maxstate<rule.state){
				maxstate=rule.state;
			}
			/*
			if(maxstate<rule.newstate){
				maxstate=rule.newstate;
			}
			*/
			if(maxchar<rule.chr){
				maxchar=rule.chr;
			}
			/*
			if(maxchar<rule.newchar){
				maxchar=rule.newchar;
			}
			*/
		}
		code[0].length=Number(maxchar);
		console.timeEnd("assembling");
		console.log("Array fill ratio: "+Number(rules)/Number((maxchar+1n)*(maxstate+1n)));
		return code;
	}
	
}