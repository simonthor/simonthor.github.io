const scale = 50;

// TODO: remove w, h parameters?
class Block {
    constructor (board, x, y, color) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.w = scale;
        this.h = scale;
        this.color = color;
    }

    draw_block() {
        this.board.ctx.beginPath();
        this.board.ctx.rect(this.x, this.y, this.w, this.h);
        this.board.ctx.fillStyle = this.color;
        this.board.ctx.fill();
        this.board.ctx.closePath();
    }

    clear_block() {
        this.board.ctx.clearRect(this.x, this.y, this.w, this.h);
    }

    move(direction) {
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
    }
}


class LBlock {
    constructor(board) {
        this.board = board;
        this.x = board.canvas.width / 2;
        this.y = 0;
        this.color = "#FF0000";
        this.part_blocks = str_to_block(this.states[this.rotation_state]);

        this.rotation_state = 0;

        this.states = get_states("L");

    }
}

function get_states(block_type) {
    let all_blocks = fetch("tetris_states.txt");
    console.log(typeof all_blocks, all_blocks.indexOf(block_type));
}

function str_to_block(rotation_config) {
    for (let i=0; i< rotation_config.length; i++) {

    }
}

export {Block, LBlock};