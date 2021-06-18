class astNode{
	constructor(start,end){
		this.start=start;
		this.end=end;
	}
	static fromToken(token){
		return new astNode(token.start,token.end);
	}
}
let binops=[];
{
let operators=["**","*","/","%","+","-","*",">>","<<","&","|","^"];
let types=["integer","set"];
let funformat={/* sign + is replaced by other operators*/
	integer:{
		integer:"(a,b)=>a+b",
		set:"(a,b)=>new Set([...b].map((b)=>a+b))"
	},
	set:{
		integer:"(a,b)=>new Set([...a].map((a)=>a+b))",
		set:"(a,b)=>new Set([...a].map((a)=>[...b].map((b)=>a+b)).flat())"
	}
}
for(let op of operators){
	binops[op]={}
	for(let arg1 of types){
		binops[op][arg1]={}
		for(let arg2 of types){
			let f=eval(funformat[arg1][arg2].replaceAll('+',op));//safety because user have no access to funformat and operators
			f.name=op;
			binops[op][arg1][arg2]=f;
		}
	}
}
}
let monops=[];
{
let operators=["-","~","!"];
let types=["integer","set"];
let funformat={/* sign + is replaced by other operators*/
	prefix:{
		integer:"(a)=>+a",
		set:"(a)=>new Set([...a].map((a)=>+a))"
	},
	postfix:{
		integer:"(a)=>a+",
		set:"(a)=>new Set([...a].map((a)=>a+))"
	}
}
for(let op of operators){
	monops[op]={}
	for(let pos of ["prefix"]){
		monops[op][pos]={}
		for(let arg of types){
			let f=eval(funformat[pos][arg].replaceAll('+',op));//safety because user have no access to funformat and operators
			f.name=op;
			monops[op][pos][arg]=f;
		}
	}
}
}


class binop{
	constructor(op,arg1,arg2){
		this.arg1=arg1;
		this.arg2=arg2;
		this.op=op;
	}
	stringify(h=0){
		return [
			" ".repeat(h)+this.op,
			this.arg1.stringify(h+1),
			this.arg2.stringify(h+1),
		].join('\n');
		
	}
	calc(symbols){
		return this.f(this.arg1.calc(symbols),this.arg2.calc(symbols));
	}
	typing(symbols){
		let type1=this.arg1.typing(symbols);
		let type2=this.arg2.typing(symbols);
		this.f=binops[this.op][type1][type2];
		if(type1=="integer"&&type2=="integer"){
			return "integer";
		}else if((type1=="set"||type2=="set")||(type1=="integer"||type2=="integer")){//if both are set or one is set and another is integer
			return "set";
		}
		throw "wrong type for "+op+".";
	}
}
class monop{
	constructor(op,pos,arg){
		this.arg=arg;
		this.op=op;
		this.pos=pos;
	}
	stringify(h=0){
		return [
			" ".repeat(h)+this.op,
			this.arg.stringify(h+1),
		].join('\n');
		
	}
	calc(symbols){
		return this.f(this.arg.calc(symbols));
	}
	typing(symbols){
		let type=this.arg.typing(symbols);
		this.f=monops[this.op][this.pos][type];
		if(type=="integer"){
			return "integer";
		}else if(type=="set"){//if both are set or one is set and another is integer
			return "set";
		}
		throw "wrong type for "+op+".";
	}
}
class union{
	constructor(args){
		this.args=args
	}
	
	calc(symbols){
		return new Set(this.args.map((v)=>v.calc(symbols)).flat())
	}
	toString(){
		return "union {"+this.args+'}';
	}
	stringify(h=0){
		return [
			" ".repeat(h)+"union\n"+
			this.args.map((a)=>a.stringify(h+1)).join('\n')
		].join('\n');
		
	}
	typing(symbols){
		this.args.forEach((a,i)=>{
			if(a.typing(symbols)=="set"){
				this.args[i]=new func((a)=>[...a],[a]);
			}
		});
		return "set";
	}
}
class difference{
	constructor(first,second){
		this.first=first
		this.second=second
	}
	
	calc(symbols){
		let f= this.first.calc(symbols);
		let s= this.second.calc(symbols);
		if(f.size>s.size){
			s.forEach((v)=>{
				f.delete(v);
			});
		}else{
			f.forEach((v)=>{
				if(s.has(v)){
					f.delete(v);
				}
			});
		}
		return f;
	}
	stringify(h=0){
		return [
			" ".repeat(h)+"\\\n",
			this.first.stringify(h+1),
			this.last.stringify(h+1)
		].join('\n');
	}
	typing(symbols){
		if(this.first.typing(symbols)!="set"){
			this.first=new func((a)=> new Set([a]),[this.first]);
		}
		if(this.second.typing(symbols)!="set"){
			this.second=new func((a)=> new Set([a]),[this.second]);
		}
		return "set";
	}
}
class intersect{
	constructor(first,second){
		this.first=first
		this.second=second
	}
	
	calc(symbols){
		let f= this.first.calc(symbols);
		let s= this.second.calc(symbols);
		if(f.size>s.size){
			[f,s]=[s,f];
		}
		f.forEach((v)=>{
			if(!s.has(v)){
				f.delete(v);
			}
		});
		return f;
	}
	stringify(h=0){
		return [
			" ".repeat(h)+"`\n",
			this.first.stringify(h+1),
			this.last.stringify(h+1)
		].join('\n');
	}
	typing(symbols){
		if(this.first.typing(symbols)!="set"){
			this.first=new func((a)=> new Set([a]),[this.first]);
		}
		if(this.second.typing(symbols)!="set"){
			this.second=new func((a)=> new Set([a]),[this.second]);
		}
		return "set";
	}
}
class symetricdifference{
	constructor(first,second){
		this.first=first
		this.second=second
	}
	
	calc(symbols){
		let f= this.first.calc(symbols);
		let s= this.second.calc(symbols);
		if(f.size>s.size){
			[f,s]=[s,f];
		}
		f.forEach((v)=>{
			if(s.has(v)){
				s.delete(v);
			}else{
				s.add(v);
			}
		});
		return s;
	}
	stringify(h=0){
		return [
			" ".repeat(h)+"``\n",
			this.first.stringify(h+1),
			this.last.stringify(h+1)
		].join('\n');
	}
	typing(symbols){
		if(this.first.typing(symbols)!="set"){
			this.first=new func((a)=> new Set([a]),[this.first]);
		}
		if(this.second.typing(symbols)!="set"){
			this.second=new func((a)=> new Set([a]),[this.second]);
		}
		return "set";
	}
}
class range{
	constructor(first,last){
		this.first=first
		this.last=last
	}
	typing(symbols){
		if (this.first.typing(symbols)!="integer")
			throw "wrong range first argumen";
		if (this.last.typing(symbols)!="integer")
			throw "wrong range last argumen";
		return "set";
	}
	
	calc(symbols){
		let first=this.first.calc(symbols);
		let last=this.last.calc(symbols);
		return new Set(Array(Number(last-first+1n))
			.fill()
			.map((_,n)=>
				first+BigInt(n)
			));
	}
	toString(){
		return "range <"+this.first+','+this.last+'>';
	}
	stringify(h=0){
		return [
			" ".repeat(h)+"range\n",
			this.first.stringify(h+1),
			this.last.stringify(h+1)
		].join('\n');
		
	}
}

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
	typing(){
		this.rules.forEach((r)=>r.typing(this.symbols));
	}
	*getGenerator(){
		for(let rule of this.rules){
			yield* rule.getGenerator(this.symbols);
		}
	}
}
class identifier{
	constructor(value,start,end){
		this.name=value;
		this.start=start;
		this.end=end;
	}
	static fromToken(token){
		return new identifier(token.value,token.start,token.end);
	}
	calc(symbols){
		if(!symbols.has(this.name)){
			throw new undeclaredIdentifierError(this);
		}
		return symbols.get(this.name).value;
	}
	stringify(h=0){
		return " ".repeat(h)+this.name;
	}
	typing(symbols){
		if(!symbols.has(this.name)){
			throw new undeclaredIdentifierError(this);
		}
		return symbols.get(this.name).type;
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
		return " ".repeat(h)+this.value
	}
	typing(symbols){
		return "integer";
	}
}
class set{
	constructor(value){
		this.value=new Set(value);
	}
	calc(){
		return this.value;
	}
	stringify(h=0){;
		return " ".repeat(h)+[...this.value.keys()].join(',');
	}
	typing(symbols){
		return "set";
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
	typing(symbols){
		this.args.forEach((a)=>a.typing(symbols));
		return "integer";
	}
}

class condition extends astNode{
	constructor(name,condition){
		super(name.start,condition.end);
		this.name=name;
		this.condition=condition;
	}
	calc(symbols){
		return this.condition.calc(symbols);
	}
	stringify(h=0){
		return [
			" ".repeat(h)+name.name+'=',
			this.condition.stringify(h+1)
		].join('\n');
		
	}
	typing(symbols){
		if(this.condition.typing(symbols)=="integer"){
			this.condition=new union([this.condition]);
		}
		return "set";
	}
}


class move{
	constructor(directions,steps){
		this.directions=directions;
		this.steps=steps;
		let pinchdirections= directions.map((d)=>{
			if(d instanceof identifier){
				return d.name
			}
		});
		pinchdirections.forEach((d,i)=>{
			if(pinchdirections.indexOf(d,i+1)>=0){
				throw "duplicated dimension";
			}
		});
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
	typing(symbols){
		this.directions.forEach((d)=>{
			let t=d.typing(symbols);
			if(t!="integer" && t!="set"){
				throw "bad direction";
			}
		});
		this.directions.forEach((d)=>{
			let t=d.typing(symbols);
			if(t!="integer"){
				throw "bad direction";
			}
		});
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
	toString(){
		return ['(',this.currchar,',',this.currstate,')=>(',this.newchar,',',this.newstate,')',this.move].join('');
	}
	stringify(h=0){
		return[
			' '.repeat(h)+'(',
			this.currstate.stringify(h+1),
			' '.repeat(h)+',',
			this.currchar.stringify(h+1),
			' '.repeat(h)+')=>(',
			this.newstate.stringify(h+1),
			' '.repeat(h)+',',
			this.newchar.stringify(h+1),
			' '.repeat(h)+')',
			this.move.stringify(h+1)
		].join('\n')
	}
	typing(symbols){
		if(symbols.has(this.currchar.name)){
			throw redefinitionError(this.currchar,symbols.get(this.currchar.name));
		}
		if(symbols.has(this.currstate.name)){
			throw redefinitionError(this.currstate,symbols.get(this.currstate.name));
		}
		symbols.set(this.currstate.name.name,{
			type:"integer",
			value:undefined
		}).set(this.currchar.name.name,{
			type:"integer",
			value:undefined
		})
		if(this.currstate.typing(symbols)!="set"){
			//this.currstate=new union([this.currstate]);
		}
		if(this.currchar.typing(symbols)!="set"){
			//this.currchar=new union([this.currchar]);
		}
		if(this.newstate.typing(symbols)!="integer"){
			throw "invalid type of new state in "+this.stringify();
		}
		if(this.newchar.typing(symbols)!="integer"){
			throw "invalid type of new char in "+this.stringify();
		}
		this.move.typing(symbols)
		symbols.delete(this.currstate.name.name)
		symbols.delete(this.currchar.name.name);
	}
	*getGenerator(symbols){
		if(this.currchar.name.name==this.currstate.name.name && this.currchar.name.name){
			throw new redefinitionError(this.currstate.name,this.currchar.name);
		}
		try{
			let chars=this.currchar.calc(symbols);
				symbols.set(this.currstate.name.name,{
					type:"integer",
					value:undefined
				}).set(this.currchar.name.name,{
					type:"integer",
					value:undefined
				});
			for(let chr of chars){
				symbols.get(this.currchar.name.name).value=chr;
				let states=this.currstate.calc(symbols)
				for(let state of states){
					symbols.get(this.currstate.name.name).value=state;
					yield {
						chr:chr,
						state:state,
						newchar:this.newchar.calc(symbols),
						newstate:this.newstate.calc(symbols),
						move:this.move.calc(symbols)					
					}
				}
			}
		}catch(e){
			if(e instanceof undeclaredIdentifierError && e.identifier.name==this.currstate.name.name){//if tape condition require to know state value
				let states
				try{
					states=this.currstate.calc(symbols)
				}catch(e){
					if(e instanceof undeclaredIdentifierError && e.identifier.name==this.currchar.name.name){//if tape condition and state condition require each other
						throw new cyclicDepandancyError(this.currstate,this.currchar);
					}else {
						throw e;
					}
				}
				symbols.set(this.currstate.name.name,{
					type:"integer",
					value:undefined
				}).set(this.currchar.name.name,{
					type:"integer",
					value:undefined
				})
				for(let state of states){
					symbols.get(this.currstate.name.name).value=state;
					let chars=this.currchar.calc(symbols)
					for(let chr of chars){
						symbols.get(this.currchar.name.name).value=chr;
						yield {
							chr:chr,
							state:state,
							newchar:this.newchar.calc(symbols),
							newstate:this.newstate.calc(symbols),
							move:this.move.calc(symbols)					
						}
					}
				}
			}else{
				throw e;
			}
		}
		
		symbols.delete(this.currstate.name.name)
		symbols.delete(this.currchar.name.name);
	}
}

