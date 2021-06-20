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
		/*if(rules!=code.length*code[0].length){//todo: correct!
			for(let chr=0;i<this.AST.getMaxChar();++i){
				if(code[i]==undefined)
					code[i]=[];
				for(let j=0;j<this.AST.getMaxState();++j)
					if(code[i][j]==undefined)
						code[i][j]==[i,j,[0,0]]
			}
		}*/
		/*
		if(rules!=(AST.getMaxChar()+1)*(AST.getMaxState()+1)){
			for(let chr=0;i<this.AST.getMaxChar();++i){
				if(code[i]==undefined)
					throw "there is no definition for character "+ i +"('"+String.fromCharCode(i)+"')."
				for(let j=0;j<this.AST.getMaxState();++j)
					if(code[i][j]==undefined)
						throw "there is no definition for state "+ j+ "for char "+ i +"('"+String.fromCharCode(i)+"')."
			}
			throw ""
		}
		*/
		return this.code;
	}
	
}