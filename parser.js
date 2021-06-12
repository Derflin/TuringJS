class parser{
	constructor(lexer){
		this.lexer=lexer;
		this.ahead=[this.lexer.getToken()];
		this.ahead.push(this.lexer.getToken());
	}
	getAST(){
		return this.program()
	}
	get curr(){
		return this.ahead[0];
	}
	next(){
		this.ahead.shift();
		this.ahead.push(this.lexer.getToken());
	}
	test(type,value){//require to given arguments fit
		if(type==this.curr[0] && (value==this.curr[1] || value==null || value==undefined)){
			let ret=this.curr[1]
			this.next();
			return ret;
		}else{
			this.throwUnexpectedToken([type])
		}
	}
	match(type,value){//if type is fit return value
		if(type!=this.curr[0]){
			return false;
		}else if(value==this.curr[1]){
			this.next();
			return true;
		}else if(value==null || value==undefined){
			this.next();
			return this.curr[1];
		}else{
			return false;
		}
	}
	pinch(type,def){//if type fit return value, else default
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
	throwUnexpectedToken(expects){
		throw new unexpectedTokenError(this.curr,expects);
	}
	
	createRule(currState,currChar,newState,newChar,motion){
		return [currState,currChar,newState,newChar,motion];
	}
	
	program(){
		let symbols=this.definitions()
		let ast=new AST(symbols);
		let rule;
		while(this.curr[0]=="("){
			rule=this.rule()
			ast.add(rule);
		}
		this.test("eof");
		return [ast,undefined];
	}
	definitions(){
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
						type:"integer",
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
					type:"integer",
					value:value
				});
			}
		}
		if(symbols.get("directions")==undefined){
			symbols.set("directions",{
				type:"integer",
				value:2n
			}).set("x",{
				type:"integer",
				value:0n
			}).set("y",{
				type:"integer",
				value:1n
			});
		}
		return symbols
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
		let curchar=this.tape_condition();
		this.test(",");
		let curstate=this.state_condition();
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
		return this.expression_assign();
	}
	state_condition(){
		return this.expression_assign();
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
			step=1n;
			break;
		case'-':
			step=-1n;
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
			let directions=[],steps=[];
			switch(this.curr[0]){
				case'+':
				case'-':
					[directions,steps]=this.secondmove();
			}
			directions.push(new identifier(dim));
			steps.push(new integer(step));
			return new move(directions,steps);
		}else{
			return new move([new integer(0)],[new integer(step)])
		}
	}
	secondmove(){
		let step
		switch(this.curr[0]){
		case'+':
			step=1n;
			break;
		case'-':
			step=-1n;
			break;
		default:
			throw this.error();
		}
		this.next();
		if(this.curr[0]=="integer"){
			step*=this.curr[1];
			this.next();
		}
		if(this.curr[0]=="identifier"){
			let dim=this.curr[1];
			this.next();
			let directions=[],steps=[];
			switch(this.curr[0]){
				case'+':
				case'-':
					[directions,steps]=this.secondmove();
			}
			directions.push(new identifier(dim));
			steps.push(new integer(step));
			return [directions,steps];
		}else{
			throw this.error()
		}
	}
	
	expression(){
		return this.expression5();
	}
	
	expression0(){//integer,identifier,(),unary - ~ !
		let a,b,f;
		do{
			switch(this.curr[0]){
			case"integer":
				return new integer(this.test("integer"));
			case"identifier":
				return new identifier(this.test("identifier"));
			case'(':
				this.next();
				a = this.expression();
				this.test(')');
				return a;
			case'<':
				this.next();
				a = this.expression();
				this.test(',');
				b = this.expression();
				this.test('>');
				return new range(a,b);
			case'{':
				this.next();
				let set=[];
				if(this.match('}')){
					return new set();
				}
				do{
					set.push(this.expression());
				}while(this.match(','));
				this.test('}');
				return new union(set);
			case'-':
				this.next();
				f=(a)=>-a;
				break;
			case'~':
				this.next();
				f=(a)=>~a;
				break;
			case'!':
				this.next();
				f=(a)=>!a;
				break;
			default:
				return a;
			}
			a=new func(f,[this.expression()]);
		}while(true);
	}
	expression1(){// **
		let a=this.expression0();
		let b;
		do{
			switch(this.curr[0]){
			case"**":
				this.next();
				 b=this.expression1();
				a= new binop("**",a,b);
				break;
			default:
				return a;
			}
		}while(true);
	}
	expression2(){//* / %
		let a=this.expression1();
		let b;
		do{
			switch(this.curr[0]){
			case"*":
				this.next();
				 b=this.expression1();
				a= new binop("*",a,b);
				break;
			case"/":
				this.next();
				b=this.expression1();
				a= new binop("/",a,b);
				break;
			case"%":
				this.next();
				b=this.expression1();
				a= new binop("%",a,b);
				break;
			default:
				return a;
			}
		}while(true);
	}
	expression3(){// + -
		let a=this.expression2();
		let b;
		do{
			switch(this.curr[0]){
			case"+":
				this.next();
				b=this.expression2();
				a= new binop("+",a,b);
				break;
			case"-":
				this.next();
				b=this.expression2();
				a= new binop("-",a,b);
				break;
			default:
				return a;
			}
		}while(true);
	}
	expression4(){// >> <<
		let a=this.expression3();
		let b;
		do{
			switch(this.curr[0]){
			case"<<":
				this.next();
				b=this.expression3();
				a= new binop("<<",a,b);
				break;
			case">>":
				this.next();
				b=this.expression3();
				a= new binop(">>",a,b);
				break;
			default:
				return a;
			}
		}while(true);
	}
	expression5(){// & | ^
		let a=this.expression4();
		let b;
		do{
			switch(this.curr[0]){
			case"&":
				this.next();
				b=this.expression4();
				a= new binop("&",a,b);
				break;
			case"|":
				this.next();
				b=this.expression4();
				a= new binop("|",a,b);
				break;
			case"^":
				this.next();
				b=this.expression4();
				a= new binop("^",a,b);
				break;
			default:
				return a;
			}
		}while(true);
	}
	expression_assign(){
		let name,expr;
		switch(this.curr[0]){
		case"identifier":
			switch(this.ahead[1][0]){
			case"=":
				name=this.test("identifier");
				this.next();//skip =
				expr=this.expression();
				return new condition(name,expr);
			}
		}
		name="";
		expr=this.expression();
		return new condition(name,expr);
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