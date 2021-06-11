const max_columns = 11;
const max_rows = 11;
const max_red_offset = 3;
const animationFrames = 50;
const Direction = {
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4,
}

class Display {

	//public

	constructor() {
		this.pos = [0, 0];
		this.posRed = [0, 0];
		this.state = 0;
		this.destPos = [0, 0];
		this.destPosRed = [0, 0];
		this.animationCounter = 0;
		this.animationStarted = false;
		this.dataArray = [];
		
		this.editMode = false;
		this.editPos = [0, 0];
		
		this.doUpdate();
	}
	
	changeState(newState) {
		this.state = newState;
		this.doUpdate();
	}

	insertData(){
		this.editMode = false;
		if(this.animationStarted == false) {
			this.pos = [0, 0];
			this.posRed = [0, 0];
			
			var regex = /[A-Za-z]+/g;
			var text = document.getElementById('inputData').value;
			var stringList = text.match(regex);
			
			this.dataArray = [];
			for(var y = 0; y < stringList.length; y++){
				this.dataArray[y] = [];
				for(var x = 0; x < stringList[y].length; x++){
					this.dataArray[y][x] = stringList[y][x];
				}
			}
			
			this.doUpdate();
		}
	}

	makeMove(direction, value) {
		this.editMode = false;
		switch (direction) {
			case Direction.UP:
				this.moveUp(value);
			case Direction.DOWN:
				this.moveDown(value);
			case Direction.LEFT:
				this.moveLeft(value);
			case Direction.RIGHT:
				this.moveRight(value);
		}
	}

	canvasOnMouseClick(event) {
		var canvas = document.getElementById('canvas');
		var max_width_pixel = canvas.width;
		var max_height_pixel = canvas.height;
		var canvasLeft = canvas.offsetLeft + canvas.clientLeft;
		var canvasTop = canvas.offsetTop + canvas.clientTop;
		
		if(this.animationStarted == false) {
			var temp_y = this.pos[0] - (max_rows - 1)/2;
			var temp_x = this.pos[1] - (max_columns - 1)/2;
			var pos_x = Math.floor((event.pageX - canvasLeft) / (max_width_pixel / max_columns));
			var pos_y = Math.floor((event.pageY - canvasTop) / (max_height_pixel / max_rows));
			
			if(this.editPos[0] == temp_y + pos_y && this.editPos[1] == temp_x + pos_x && this.editMode == true) {
				this.editPos = [0, 0];
				this.editMode = false;
			}else{
				this.editPos = [temp_y + pos_y, temp_x + pos_x];
				this.editMode = true;
			}

			this.doUpdate();
		}
	}
	
	canvasOnKeyDown(event) {
		if(this.editMode == true) {
			console.log(event.keyCode.toString());
			if((event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode >= 65 && event.keyCode <= 90)){
				if(this.dataArray[this.editPos[0]] == undefined) {
					this.dataArray[this.editPos[0]] = [];
				}
				this.dataArray[this.editPos[0]][this.editPos[1]] = String.fromCharCode(event.keyCode);
			}
			
			this.doUpdate();
		}
	}

	//private

	moveUp(moveValue) {
		if(this.animationStarted == false) {
			var value = moveValue;
			if (!isNaN(value)) {
				this.animationStarted = true;
				
				if(value > max_red_offset + this.posRed[0]){
					value = value - (max_red_offset + this.posRed[0]);
					this.destPosRed = [-(max_red_offset + this.posRed[0]), 0];
					this.destPos = [-value, 0];
				}else{
					this.destPosRed = [-value, 0];
				}
				
				this.animationCounter = 0;
				this.doUpdate();
			}
		}
		return 0;
	}

	moveDown(moveValue) {
		if(this.animationStarted == false) {
			var value = moveValue;
			if (!isNaN(value)) {
				this.animationStarted = true;
				
				if(value > max_red_offset - this.posRed[0]){
					value = value - (max_red_offset - this.posRed[0]);
					this.destPosRed = [(max_red_offset - this.posRed[0]), 0];
					this.destPos = [value, 0];
				}else{
					this.destPosRed = [value, 0];
				}

				this.animationCounter = 0;
				this.doUpdate();
			}
		}
		return 0;
	}

	moveLeft(moveValue){
		if(this.animationStarted == false) {
			var value = moveValue;
			if (!isNaN(value)) {
				this.animationStarted = true;
				
				if(value > max_red_offset + this.posRed[1]){
					value = value - (max_red_offset + this.posRed[1]);
					this.destPosRed = [0, -(max_red_offset + this.posRed[1])];
					this.destPos = [0, -value];
				}else{
					this.destPosRed = [0, -value];
				}
				
				this.animationCounter = 0;
				this.doUpdate();
			}
		}
		return 0;
	}

	moveRight(moveValue){
		if(this.animationStarted == false) {
			var value = moveValue;
			if (!isNaN(value)) {
				this.animationStarted = true;
				
				if(value > max_red_offset - this.posRed[1]){
					value = value - (max_red_offset - this.posRed[1]);
					this.destPosRed = [0, (max_red_offset - this.posRed[1])];
					this.destPos = [0, value];
				}else{
					this.destPosRed = [0, value];
				}

				this.animationCounter = 0;
				this.doUpdate();
			}
		}
		return 0;
	}

	draw() {
		var canvas = document.getElementById('canvas');
		var max_width_pixel = canvas.width;
		var max_height_pixel = canvas.height;
		var ctx = canvas.getContext('2d');
		var y_offset_pixel;
		var x_offset_pixel;

		ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0, 0, max_width_pixel, max_height_pixel); // clear canvas

		//red outline for square in the middle of screen
		y_offset_pixel = 0;
		x_offset_pixel = 0;
		if(this.animationStarted == true) {
			y_offset_pixel = this.destPosRed[0] * (max_height_pixel / max_rows) * (this.animationCounter * 1.0 / animationFrames);
			x_offset_pixel = this.destPosRed[1] * (max_width_pixel / max_columns) * (this.animationCounter * 1.0 / animationFrames);
		}
		
		ctx.strokeStyle = "Red";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.rect((((max_columns - 1) / 2) + this.posRed[1]) * (max_width_pixel / max_columns) + x_offset_pixel, (((max_rows - 1) / 2) + this.posRed[0]) * (max_height_pixel / max_rows) + y_offset_pixel, max_width_pixel / max_columns, max_height_pixel / max_rows);
		ctx.stroke();
		ctx.font = "10px Verdana";
		ctx.fillStyle = "Red";
		ctx.fillText(this.state, (((max_columns - 1) / 2) + this.posRed[1] + 0.05) * (max_width_pixel / max_columns) + x_offset_pixel, (((max_rows - 1) / 2) + this.posRed[0] + 0.95) * (max_height_pixel / max_rows) + y_offset_pixel);

		//draw cells - black for out of table cells, black outline for square with text otherwise
		var temp_y = this.pos[0] - (max_rows - 1)/2;
		var temp_x = this.pos[1] - (max_columns - 1)/2;
		
		y_offset_pixel = 0;
		x_offset_pixel = 0;
		
		if(this.animationStarted == true) {
			y_offset_pixel = this.destPos[0] * (max_height_pixel / max_rows) * (this.animationCounter * 1.0 / animationFrames);
			x_offset_pixel = this.destPos[1] * (max_width_pixel / max_columns) * (this.animationCounter * 1.0 / animationFrames);
		}
		
		var y = (this.destPos[0] < 0) ? this.destPos[0] : 0;
		var max_y = (this.destPos[0] > 0) ? max_rows + this.destPos[0] : max_rows;
		for(y; y < max_y; y++) {
			var x = (this.destPos[1] < 0) ? this.destPos[1] : 0;
			var max_x = (this.destPos[1] > 0) ? max_columns + this.destPos[1] : max_columns;
			for(x; x < max_x; x++) {
				
				//draw black square outline
				ctx.strokeStyle = "Black";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.rect(x * (max_width_pixel / max_columns) - x_offset_pixel, y * (max_height_pixel / max_rows) - y_offset_pixel, max_width_pixel / max_columns, max_height_pixel / max_rows);
				ctx.stroke();
				
				//write text in data table (in view)
				ctx.font = "30px Verdana";
				ctx.fillStyle = "Black";
				if(this.dataArray[temp_y + y] != undefined && this.dataArray[temp_y + y][temp_x + x] != undefined){
					ctx.fillText(this.dataArray[temp_y + y][temp_x + x], x * (max_width_pixel / max_columns) + (0.30 * max_width_pixel / max_columns) - x_offset_pixel, y * (max_height_pixel / max_rows) + (0.65 * max_height_pixel / max_rows) - y_offset_pixel);
				}
			}
		}
		
		//outgrid
		ctx.strokeStyle = "Blue";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.rect(0, 0, max_width_pixel, max_height_pixel);
		ctx.stroke();
		
		//pink filled rectangle indicating cell being edited
		if(this.editMode == true) {
			ctx.fillStyle = "Pink";
			ctx.fillRect((this.editPos[1] - temp_x) * (max_width_pixel / max_columns), (this.editPos[0] - temp_y) * (max_height_pixel / max_rows), (max_height_pixel / max_rows), (max_width_pixel / max_columns));
		}

		//queue another animation frame
		if(this.animationStarted == true) {
			this.animationCounter = this.animationCounter + 1;
			if(this.animationCounter == animationFrames) {
				this.animationStarted = false;
				this.pos[0] = parseInt(this.pos[0]) + parseInt(this.destPos[0]);
				this.pos[1] = parseInt(this.pos[1]) + parseInt(this.destPos[1]);
				this.destPos = [0, 0];
				this.posRed[0] = parseInt(this.posRed[0]) + parseInt(this.destPosRed[0]);
				this.posRed[1] = parseInt(this.posRed[1]) + parseInt(this.destPosRed[1]);
				this.destPosRed = [0, 0];
			}
			this.doUpdate();
		}
	}

	doUpdate() {
		window.requestAnimationFrame(()=>this.draw());
	}

}