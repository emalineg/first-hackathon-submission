function changeLang(lang){
    switch(lang) {
        case "en":
            document.getElementById("intro_en").style.visibility = "visible";
            document.getElementById("intro_fr").style.visibility = "hidden";
            break;
        case "fr":
            document.getElementById("intro_en").style.visibility = "hidden";
            document.getElementById("intro_fr").style.visibility = "visible";
            break;
        default:
            document.getElementById("intro_fr").style.visibility = "hidden";
            document.getElementById("intro_en").style.visibility = "visible";
    }    
}