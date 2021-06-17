class compilingError extends Error{
	constructor(start,end,name,message){
		let posmessage="("+start[0]+","+start[1]+")"+message;
		super(posmessage);
		this.start=start;
		this.end=end;
	}
}

class unexpectedCharacterError extends compilingError{
	constructor(position,unexpected,expects){//poistion=[row,column,swquently]
		let message=" Unexpected character \""+unexpected+"\""
		if(typeof(expects)==="string" && expects.length>0){
			message+=", expected \""+expects.slice(0,-1).split("").join("\",\"")
			if(expects.length!=1){
				message+="\" or \""
			}
			message+=expects+"\""
		}else if( expects instanceof RegExp){
			message+=" don't fit to: "+expects;
		}
		message+=".";
		let end=[position[0],position[1]+1,position[2]+1];
		super(position,end,"unexpectedCharacter",message);
		this.expects=expects;
		
	}
}
class unexpectedTokenError extends compilingError{
	constructor(unexpected,expects){
		let message=" Unexpected token \""+unexpected.toString()+"\""
		if(expects){
			message+=" expected \""
			if(typeof(expects)==="string" && expects.length>0){
				expects=[expects];
			}
			message+=expects.slice(0,-1).join("\",\"")
			if(expects.length>1){
				message+="\" or \""
			}
			message+=expects.slice(-1)+"\""
		}
		message+=".";
		super(unexpected.start,unexpected.end,"unexpectedToken",message);
		this.unexpected=unexpected;
		this.expects=expects;
		
	}
}
class unclosedError extends compilingError{
	constructor(opened,closing,name){//poistion=[start,end]
		let message=" Unclosed "+name +" expected \""+closing+"\" before end of file.";
		super(opened.start,opened.end,"unclosed",message);
		this.opened=opened;
		this.closing=closing;
		this.name=name;
		
	}
}
class undeclaredIdentifierError extends compilingError{
	constructor(identifier){//
		let message=" '"+identifier.name+"' is undeclared";
		super(identifier.start||["don't suported","don't suported"],identifier.end||["don't suported","don't suported"],"undeclaredIndentifier",message);
		this.identifier=identifier;
		
	}
}
class redefinitionError extends compilingError{
	constructor(identifier,previous){
		let message=" '"+identifier.name+"' is already declared at ("+previous.start[0]||"don't suported"+','+previous.start[1]||"don't suported"+'.';
		super(identifier.start||["don't suported","don't suported"],identifier.end||["don't suported","don't suported"],"redefinitionIndentifier",message);
		this.identifier=identifier;
		this.previous=previous;
		
	}
}

class cyclicDepandancyError extends compilingError{
	constructor(state,char){
		let message=" '"+state.name+"' and '"+char.name+"' require to know each another, now no one is known.";
		super(char.start||["don't suported","don't suported"],state.end||["don't suported","don't suported"],"cyclicDepandancy",message);
		this.state=state;
		this.char=char;
		
	}
}
