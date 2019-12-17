const nl = "<br/>";

function responsechange () {
    switch (this.readyState) {
        case 4:
            if (this.status === 200) {
                document.getElementById(id).innerHTML += response + nl;
                break;
            }else return;
        default:
            return;
    }
}

function main (id) {
    // Not working
    document.getElementById(id).innerHTML += "inside main" + nl;
    let websiteurl = "https://teamtrees.org";
    let request = new XMLHttpRequest();
    request.onreadystatechange = responsechange();
    document.getElementById(id).innerHTML += "object created" + nl;
    request.open('GET', websiteurl, false);  // third param is sync/async
    document.getElementById(id).innerHTML += "opened" + nl;
    request.send();
    document.getElementById(id).innerHTML += "sent" + nl;
    var response = request.responseText;
    document.getElementById(id).innerHTML = "typeof response" + nl;
    document.getElementById(id).innerHTML += response + nl;
}