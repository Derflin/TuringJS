class AST{
	constructor(symbols,states,chars,dirs){
		this.symbols=symbols;
		/*this.states=states;
		this.chars=chars;
		this.dirs=dirs;*/
		this.rules=[];
	}
	add(rule){
		this.rules.push(rule);
	}
	getIterator(){
		return new this.iterator(this);
	}
	stringify(h=0){ 
		return [
			[...this.symbols].map((a)=>' '.repeat(h)+a[0]+'\n'+Object.entries(a[1]).map((x)=>' '.repeat(h+1)+x[0]+':'+x[1]).join('\n')).join('\n'),
			/*this.states.stringify(h+1),
			this.chars.stringify(h+1),
			this.dirs.stringify(h+1),*/
			this.rules.map((r)=>r.stringify(h+1)).join('\n')
		].join('\n');
	}
	iterator=class{
		constructor(ast){
			this.rules=ast.rules;
			this.symbols=ast.symbols;
			this.currRule=0;
			this.iterator=this.rules[this.currRule].getIterator(this.symbols);
		}
		getRule(/*symbols*/){
			do{
				let rule = this.iterator.getRule();
				if(rule==null){
					this.currRule++;
					if(this.currRule>=this.rules.length){
						return null;
					}
					this.iterator=this.rules[this.currRule].getIterator(this.symbols);
				}else{
					return rule;
				}
			}while(true);
		}
	}
}
class identifier{
	constructor(value){
		this.name=value
	}
	calc(symbols){
		return symbols.get(this.name).value;
	}
	stringify(h=0){
		return " ".repeat(h)+this.name;
	}
}

class integer{
	constructor(value){
		this.value=value;
	}
	calc(){
		return this.value;
	}
	stringify(h=0){
		return " ".repeat(h)+this.value;
	}
}


class func{
	constructor(f,args){
		this.f=f;
		this.args=args;
	}
	calc(symbols){
		return this.f(...this.args.map((v)=>v.calc(symbols)))
	}
	toString(){
		return this.f.toString()+'('+this.args+')';
	}
	stringify(h=0){
		return [
			" ".repeat(h)+
			(this.f.name!=""?this.f.name:this.f.toString()),
			this.args.map((a)=>a.stringify(h+1)).join('\n')
		].join('\n');
		
	}
}

class expression{
	constructor(init){
		this.value=init;
	}
	
}

class move{
	constructor(directions,steps){
		this.directions=directions;
		this.steps=steps;
	}
	calc(symbols){
		let ret=new Array(symbols.get("directions").value).fill(0);
		for(let i=0;i<this.directions.length;++i){
			ret[this.directions[i].calc(symbols)]=this.steps[i].calc(symbols);
		}
		return ret;
	}
	stringify(h=0){
		let str=[];
		for(let i = 0 ; i< this.directions.length ; ++i){
			str.push(this.steps[i].stringify(h+1),this.directions[i].stringify(h+1));
		}
		return str.join('\n');
	}
}
class rule{
	constructor(currstate,currchar,newstate,newchar,move){
		this.currstate=currstate;
		this.currchar=currchar;
		this.newstate=newstate;
		this.newchar=newchar;
		this.move=move;
	}
	get value(){
		let rules=[];
		while(true){
			let rule=this.getRule();
			if(rule==null || rule==undefined)
				break;
			rules.push(rule);
		}
		return rules;
	}
	toString(){
		return ['(',this.currchar,',',this.currstate,')=>(',this.newchar,',',this.newstate,')',this.move].join('');
	}
	stringify(h=0){
		return[
			' '.repeat(h)+'(',
			this.currchar.stringify(h+1),
			' '.repeat(h)+',',
			this.currstate.stringify(h+1),
			' '.repeat(h)+')=>(',
			this.newchar.stringify(h+1),
			' '.repeat(h)+',',
			this.newstate.stringify(h+1),
			' '.repeat(h)+')',
			this.move.stringify(h+1)
		].join('\n')
	}
	iterator=class {
		constructor(rule,symbols){
			this.chars=[rule.currchar.calc(symbols)];
			this.states=[rule.currstate.calc(symbols)];
			
			this.newchars=rule.newchar;
			this.newstates=rule.newstate;
			this.moves=rule.move;
			
			this.currChar=0;
			this.currState=0;
			
			this.symbols=symbols;
		}
		getRule(/*symbols*/){
			let ret= {
				chr:this.chars[this.currChar],
				state:this.states[this.currState],
				newchar:this.newchars.calc(this.symbols),
				newstate:this.newstates.calc(this.symbols),
				move:this.moves.calc(this.symbols)
			}
			if(this.currChar>=this.chars.length){
				this.currChar=0;
				this.currState++;
				if(this.currState>=this.states.length){
					return null;
				}
			}else{
				this.currChar++;
			}
			return ret;
		}
	}
	getIterator(symbols){
		return new this.iterator(this,symbols);
	}
}

