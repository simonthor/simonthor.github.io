async function read_json (file) {

    let request = new XMLHttpRequest();
    request.open('GET', file);
    request.responseType = 'json';
    await request.send();
    request.onload = () => {
        console.log(request.response);
    };
}