class Compiler{
	constructor(lexer,parser,assembler){
		this.lexer=lexer;
		this.parser=parser;
		this.assembler=assembler;
	}
	compile(code){
		let [ast,dbg]=new this.parser(new this.lexer(code)).getAST();
		ast.typing();
		let program=new this.assembler(ast).assembly();
		return [program,dbg];
	}
	
}
