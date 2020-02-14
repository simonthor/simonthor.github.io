function setBackground () {
    let image_url = createImageUrl("screen");

    document.body.style.backgroundImage = "url(" + image_url + ")";
    document.body.style.backgroundSize = "cover";
    document.body.style.filter = "brightness(50&´%)";
    document.getElementById("ImageCredit").innerText += image_url;
}

function createImageUrl (size="large", ID=false, potw=false) {
    let image_url = "https://cdn.eso.org/images/" + size + "/";
    if (potw) {
        image_url += "potw";
    }
    else {
        image_url += "eso";
    }
    if (ID) {
        image_url += ID;
        if (/^\d+$/.test(ID)) {
            image_url += "a";
        }
    }
    else {
        let imageIDs = ["1131a", "0846a", "1221a", "9845d", "0903a", "0839a", "1137a"];
        let index = Math.floor(Math.random() * imageIDs.length);
        image_url += imageIDs[index];
    }
    image_url += ".jpg";
    return image_url;
}