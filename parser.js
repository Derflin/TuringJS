class parser{
	constructor(lexer){
		this.lexer=lexer;
		this.curr=this.lexer.getToken();
	}
	getAST(){
		return this.program()
	}
	next(){
		this.curr=this.lexer.getToken();
		if(this.curr==undefined)
			alert(this.curr)
	}
	test(type,value){
		if(type==this.curr[0] && (value==this.curr[1] || value==null || value==undefined)){
			let ret=this.curr[1]
			this.next();
			return ret;
		}else{
			throw this.error();
		}
	}
	match(type,value){
		if(type!=this.curr[0]){
			return false;
		}else if(value==this.curr[1]){
			return true;
		}else if(value==null || value==undefined){
			return this.curr[1];
		}else{
			return false;
		}
	}
	pinch(type,def){
		if(type!=this.curr[0]){
			return def;
		}else{
			return this.curr[1];
		}
	}
	error(message){
		let pos='('+this.lexer.tokenLine+','+this.lexer.tokenColumn+')';
		if(message==null || message==undefined)
			message="Unexpected token: "+this.curr[0];
		return pos+message;
	}
	createRule(currState,currChar,newState,newChar,motion){
		return [currState,currChar,newState,newChar,motion];
	}
	
	program(){
		let symbols=new Map();
		while(this.curr[0]=="identifier"){
			switch(this.curr[1]){
			case'reg':
				this.next();
				switch(this.curr[0]){
				case'=':
					this.next();
					let value=this.test("integer");
					symbols.set("states",{
						type:"constant",
						value:value
					});
				break;
				case'{':
				
				break;
				default:
					throw this.error();
				}
			break;
			default:
				let name=this.test("identifier");
				this.test("=");
				let value=this.test("integer");
				if(symbols.has(name)){
					throw this.error("Redefinition of "+name+".");
				}
				symbols.set(name,{
					type:"constant",
					value:value
				});
			}
		}
		if(symbols.get("directions")==undefined){
			symbols.set("directions",{
				type:"constant",
				value:2
			}).set("x",{
				type:"direction",
				value:0
			}).set("y",{
				type:"direction",
				value:1
			});
		}
		/*[
			["x",{type:"direction",value:0,min:0,max:2}],
			["y",{type:"direction",value:1,min:0,max:2}],
			//["z",{type:"direction",value:2,min:0,max:2}],
			["directions",{type:"type",min:0,max:1}],
			["states",{tpye:"type",min:0,max:255}],
			["chars",{type:"type",min:0,max:255}],
			["",{type:"default",value:0}]
		]*/
		let ast=new AST(symbols);
		let rule;
		while(this.curr[0]=="("){
			rule=this.rule()
			ast.add(rule);
		}
		return [ast,undefined];
	}
	
	getRules(){
		let rules=[];
		while(this.curr!=null && this.curr!=undefined && this.curr[0]!="eof"){
			rules.push(this.getRule());
		}
		return rules;
	}
	getRule(){
		return this.rule();
	}
	rule(){
		this.test("(");
		let curstate=this.tape_value();
		this.test(",");
		let curchar=this.tape_condition();
		this.test(")");
		this.test("=>");
		this.test("(");
		let newstate=this.state_value();
		this.test(",");
		let newchar=this.tape_value();
		this.test(")");
		let move=this.move();
		return new rule(curstate,curchar,newstate,newchar,move);
	}
	tape_condition(){
		return this.expression();
	}
	tape_value(){
		return this.expression();
	}
	tape_value(){
		return this.expression();
	}
	state_value(){
		return this.expression();
	}
	move(){
		let step
		switch(this.curr[0]){
		case'+':
			step=1;
			break;
		case'-':
			step=-1;
			break;
		default:
			return new move([new integer(0)],[new integer(0)]);
		}
		this.next();
		if(this.curr[0]=="integer"){
			step*=this.curr[1];
			this.next();
		}
		
		if(this.curr[0]=="identifier"){
			let dim=this.curr[1];
			this.next();
			return new move([new identifier(dim)],[new integer(step)])
		}else{
			return new move([new integer(0)],[new integer(step)])
			
		}
	}
	
	expression(){
		return this.expression2();
	}
	
	expression0(){//integer,identifier,(),unary
		let a;
		switch(this.curr[0]){
		case"integer":
			return new integer(this.test("integer"));
		case"identifier":
			return new identifier(this.test("identifier"));
		case'(':
			this.next();
			a = this.expression();
			this.test(')');
			break;
		/*case'{':
			this.next();
			let set=[];
		while(this.curr[0]!='}'){
				set.push(this.expression());
			}
			a=*/
		case'-':
			this.next();
			a= new func((a)=>-a,[a]);
			break;
		case'~':
			this.next();
			a= new func((a)=>a,[a]);
			break;
		case'!':
			this.next();
			a= new func((a)=>a-b,[a]);
			break;
		default:
			throw this.error()
		}
		return a;
	}
	expression1(){
		let a=this.expression0();
		let b;
		do{
			switch(this.curr[0]){
			case"*":
				this.next();
				 b=this.expression0();
				a= new func((a,b)=>a*b,[a,b]);
				break;
			case"/":
				this.next();
				b=this.expression0();
				a= new func((a,b)=>a/b,[a,b]);
				break;
			default:
				return a;
			}
		}while(true);
	}
	expression2(){
		let a=this.expression1();
		let b;
		do{
			switch(this.curr[0]){
			case"+":
				this.next();
				b=this.expression1();
				a= new func((a,b)=>a+b,[a,b]);
				break;
			case"-":
				this.next();
				b=this.expression1();
				a= new func((a,b)=>a-b,[a,b]);
				break;
			default:
				return a;
			}
		}while(true);
	}
	
	assignConstatn(){
		let name=this.test("identifier");
		this.test("=");
		let value=this.test("integer");
		return [name,value];
		if(symbols.has(name)){
			throw this.error("Redefinition of "+name+".");
		}
		symbols.set(name,{
			type:"constant",
			value:value
		});
	}
	assingConstants(){
		let vars=new Map();
		while(this.curr[0]){
			vars.set(...assignConstant());
		}
	}
}