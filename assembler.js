class assembler{
	constructor(AST){
		this.AST=AST;
		this.code=[];
	}
	assembly(){
		let rule;
		let rules=0n;
		let maxstate=0n;
		let maxchar=0n;
		for(rule of this.AST.getGenerator(AST.symbols)){
			if(this.code[rule.state]==undefined){
				this.code[rule.state]=[];
			}
			if(this.code[rule.state][rule.chr]!= undefined)
				throw "redefinition"
			this.code[rule.state][rule.chr]=[rule.newchar,String.fromCharCode(Number(rule.newstate)),rule.move.map((step)=>Number(step))];
			++rules;
			
			if(maxstate<rule.state){
				maxstate=rule.state;
			}
			if(maxstate<rule.newstate){
				maxstate=rule.newstate;
			}
			if(maxchar<rule.chr){
				maxchar=rule.chr;
			}
			if(maxchar<rule.newchar){
				maxchar=rule.newchar;
			}
			
			
			
		}
		console.log("Full array fill ratio: "+Number(rules)/Number((maxchar+1n)*(maxstate+1n)));
		return this.code;
	}
	
}