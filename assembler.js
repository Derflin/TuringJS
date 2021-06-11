class assembler{
	constructor(AST){
		this.AST=AST;
		this.code=[];
	}
	assembly(){
		let rule;
		let rules=0;
		let maxstate=0;
		let maxchar=0;
		while(rule = this.AST.getRule(AST.symbols)){
			if(this.code[rule.state]==undefined){
				this.code[rule.state]=[];
			}
			this.code[rule.state][rule.chr]=[rule.newstate,String.fromCharCode(rule.newchar),rule.move];
			++rules;
			maxstate=Math.max(maxstate,rule.state,rule.newstate);
			maxchar=Math.max(maxchar,rule.chr,rule.newchar);
			
			
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