import * as block_types from "./blocks.js";

const scale = 50;
// TODO: make this customizable
const dt = 500;


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
    new block_types.LBlock(board);
    //document.addEventListener("keydown", event => {board.move_block(event, board)});
    //window.setInterval(update_board, dt, board);
}