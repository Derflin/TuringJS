class compilingError extends Error{
	constructor(){
		super([...arguments]);
	}
}

class unexpectedCharacterError extends compilingError{
	constructor(position,unexpected,expects){//poistion=[row,column,position]
		let message="("+position[0]+","+position[1]+") Unexpected character \""+unexpected+"\""
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
		super(message);
		this.name="unexpectedCharacter";
		this.start=position;
		this.end=[position[0],position[1]+1,position[2]+1]
		this.unexpected=unexpected;
		this.expects=expects;
		
	}
}
class unexpectedTokenError extends compilingError{
	constructor(unexpected,expects){
		let message="("+unexpected.start[0]+","+unexpected.start[1]+") Unexpected token \""+unexpected.toString()+"\""
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
		super(message);
		this.name="unexpectedToken";
		this.unexpected=unexpected;
		this.expects=expects;
		
	}
	get start(){
		return this.unexpected.start;
	}
	get end(){
		return this.unexpected.end;
	}
}
class unclosedError extends compilingError{
	constructor(opened,closing,name){//poistion=[start,end]
		let message="("+opened.start[0]+","+opened.start[1]+") Unclosed "+name +" expected \""+closing+"\" before end of file.";
		super(message);
		this.name="unclosed";
		this.opened=opened;
		this.closing=closing;
		this.name=name;
		
	}
	get start(){
		return this.opened.start;
	}
	get end(){
		return this.opened.end;
	}
}