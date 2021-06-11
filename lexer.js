class lexer{
	constructor(code){
		this.code=code;
		this.pos=0;
		this.line=1;
		this.column=1;
		this.tokenLine=1;
		this.tokenColumn=1;
	}
	
	get curr(){
		return this.code.charAt(this.pos);
	}
	next(){
		this.line+=this.curr=='\n';
		this.column=(this.curr=='\n')?1:this.column+1;
		this.pos++;
	}
	
	match(c){
		if(this.curr==c){
			this.next();
			return this.createToken(c);
		}else{
			return false;
		}
	}
	
	error(message){
		let pos_inf="("+this.line+","+this.column+")";
		if(message==null || message==undefined)
			message="Unexpected character: "+this.curr;
		return pos_inf+message;
	}
	ok(message){
		return (message==undefined)?"Succed lexical analize":message;
	}
	/*
	Token		value
	(			
	)			
	,	
	=>
	integer		integer reprezantation of number
	identifier	string representation of name
	eof
			
			
			
			
			
			
			
			
			
	
 	*/
	createToken(type,value){
		/*
		if(value==null || value==undefined)
			alert(type);
		else
			alert(type+": "+value);
		//*/
		
		this.tokenLine=this.line;
		this.tokenColumn=this.column-1;
		return [type,value];
	}
	
	getTokens(){
		let tokens=[];
		let token;
		do{
			token=this.getToken()
			tokens.push(token);
		}while(token[0]!="eof");
		return tokens;
	}
	getToken(){
		do{
			switch(this.curr){
			//skip white characters
			case' ':
			case'\n':
			case'\t':
				this.next();
				//return this.getToken();
			break;
			//pass on tokens
			case'/'://operator,comment
				this.next();
				switch(this.curr){
				case'/'://single line comment
					this.singlelinecomment();
				break;
				case'*'://multiline comment
					this.multilinecomment();
				break
				default://operator/
					return this.createToken('/');
				}
			break;
			case'(':
			case')':
			case',':
			case'+'://operator or direction
			case'-'://operator or direction
			case'*'://operator
			case'%'://operator
				return this.match(this.curr);
			break;
			case'='://=>
				this.next();
				switch(this.curr){
				case'>':
					this.next();
					return this.createToken("=>");
				default:
					return this.createToken("=");
				}
			case'0':
			case'1':
			case'2':
			case'3':
			case'4':
			case'5':
			case'6':
			case'7':
			case'8':
			case'9':
				return this.integer();
			case"'":
				return this.character();
			//end of input
			case undefined:
			case null:
			case '':
			case '\0':
				return this.createToken("eof")
			default:
			//identifier test
				let ch=this.curr.toLowerCase()
				if('a'<=ch && ch<='z')
					return this.identifier();
				else{
					let token=this.createToken("error",this.error());
					this.next();
					return token;
				}
			}
		}while(true);
	}
	identifier(){
		let value=this.curr;
		let read=true;
		let ch=this.curr.toLowerCase()
		if(!('a'<=ch && ch<='z')){
			return this.createToken("error",error());
		}
		while(read){
			this.next();
			ch=this.curr.toLowerCase();
			if(('a'<=ch && ch<='z')||('0'<=ch && ch<='9')||ch=='_'){
				value+=this.curr;
			}else{
				read=false;
			}
		}
		return this.createToken("identifier",value);
	}
	transition(){
	}
	
	integer(){
		let value=0;
		let read=true;
		while(read){
			switch(this.curr){
			case'0':
			case'1':
			case'2':
			case'3':
			case'4':
			case'5':
			case'6':
			case'7':
			case'8':
			case'9':
				value=value*10+(this.curr-'0');
				this.next();
			break;
			case'_':
				this.next();
			break;
			default:
				read=false;
			}
		}
		return this.createToken("integer",value);
	}
	character(){
		if(!this.match("'")){
			return this.createToken("error",this.error());
		}
		let value=this.curr.charCodeAt(0);
		this.next();
		if(!this.match("'")){
			return this.createToken("error",this.error());
		}
		return this.createToken("integer",value);
	}
	singlelinecomment(){
		while(this.curr!='\n'){
			this.next();
		}
	}
	multilinecomment(){
		let start=0
		while(this.curr=='*'){
			this.next();
			start++;
		}
		
		do{
			while(this.curr!='*'){
				this.next();
			}
			let end=0;
			while(this.curr=='*'){
				this.next();
				end++;
				if(end==start && this.curr=='/'){
					this.next();
					return;
				}
			}
		}while(true);
	}
}
