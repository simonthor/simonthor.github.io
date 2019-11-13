const scale = 50;
const keyInputs = Object.freeze({
    left: 37,
    up: 38,
    right: 39,
    down: 40
});
// TODO: make this customizable
const dt = 500;


// TODO: remove w, h parameters?
function Block(board, x, y, color) {
    this.board = board;
    this.x = x;
    this.y = y;
    this.w = scale;
    this.h = scale;
    this.color = color;

    this.draw_block = function(){
        this.board.ctx.beginPath();
        this.board.ctx.rect(this.x, this.y, this.w, this.h);
        this.board.ctx.fillStyle = this.color;
        this.board.ctx.fill();
        this.board.ctx.closePath();

    };

    this.clear_block = function () {
        this.board.ctx.clearRect(this.x, this.y, this.w, this.h);
    };

    this.move = function(direction){
        // TODO: change to switch statement
        if (direction === "down") {
            this.y += scale;
        }
        else if (direction === "right") {
            this.x += scale;
        }
        else if (direction === "left") {
            this.x -= scale;
        }
        // TODO: implement space bar and rotation
    };
}

function LBlock (board) {
    this.board = board;
    this.x = board.canvas.width / 2;
    this.y = 0;
    this.color = "#FF0000";
    this.part_blocks = [ new Block(this.board, this.x, this.y, this.color),
                    new Block(this.board, this.x, this.y+scale, this.color),
                    new Block(this.board, this.x, this.y+scale*2, this.color), new Block(this.board, this.x + scale, this.y+scale, this.color)];

    this.rotation_state = 0;

    this.rotate = function () {
        switch (this.rotation_state) {
            case 0:
                // Insert correct rotation here
                this.part_blocks[0].x += scale;
                this.rotation_state++;
                break;
            case 1:

            default:
                return;
        }
    }
}

function TetrisBoard(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.blocks = [];
    this.nofree = true;

    this.generate_block = function () {
        // TODO: Implement randomization of color, shape etc.
        this.free_block = new Block(this, scale, scale, "#FF0000");
    };

    this.touch_other_block = function () {
        // TODO: implement collision mechanism
        if (this.free_block.y >= this.canvas.height - scale) {
            this.free_block.y = this.canvas.height - scale;
            return true;
        }
        else {
            return false;
        }
    };

    this.move_block = function (event, board) {
        // TODO: Change to switch statement
        board.free_block.clear_block();
        if (event.key === "ArrowRight" && board.free_block.x <= board.canvas.width - 2*scale) {
            board.free_block.move("right");
        }
        else if (event.key === "ArrowLeft" && board.free_block.x >= scale) {
            board.free_block.move("left");
        }
        board.free_block.draw_block();
    };

    this.redraw = function () {
        // TODO: Change this when line clearing has been implemented
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i=0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            block.draw_block();
        }
    }
}

function update_board (board) {
    // TODO: fix off by one error
    if (board.touch_other_block()) {
        board.blocks.push(board.free_block);
        board.nofree = true;
    }
    else {
        board.free_block.clear_block();
        board.free_block.move("down");
        board.free_block.draw_block();
    }
    // TODO: implement line clearing
    if (board.nofree) {
        board.nofree = false;
        board.free_block = board.generate_block();
        board.redraw();
    }
}

function main () {
    let canvas = document.getElementById("tetris-game");
    let board = new TetrisBoard(canvas);
    document.addEventListener("keydown", event => {board.move_block(event, board)});
    window.setInterval(update_board, dt, board);
}