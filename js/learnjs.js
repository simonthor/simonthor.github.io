/*
Test file for learning Javascript.
Author: Simon Thor
Year: 2019
 */
const nl = "<br/>";

function notice () {
    alert("You pressed a button");
}

// for (let i=0; i < 30; i++) {
//     document.write("Lorem ipsum dorot sit amet<br>");
// }

function switchcase () {
    switch (a) {
        case 0:
            break;
        case 1:
            console.log(a);
            break;
        case 2:
            document.writeln(a);
            break;
        default:
            document.write(a);
    }
}

function labelfor (iter_obj) {
    outerloop:
    for (value in iter_obj) {
        innerloop:
        for (let i=0; i< 10; i++) {
            switch (value) {
                case 1:
                    document.writeln(value);
                    break;
                case 2:
                    break innerloop;
                case 3:
                    break outerloop;
                default:
                    document.writeln(i);
            }
        }
    }
}

function returnvals () {
    return [1, 2];
}

function rickroll() {
    window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
}

function display_prompt() {
    const input = prompt("Enter password");

    if (input === null) {
        window.history.back();
        return null;
    }else if (input === "asdf") {
        return true;
    }else {
        alert("invalid password");
        return display_prompt();
    }
}

function print_page() {
    window.print();
}

function main (...args) {
    fetch('tetris_states.txt')
    .then(response => response.text())
    .then(text => console.log(text));
}

