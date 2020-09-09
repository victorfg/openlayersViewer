let closeOpenNavbar=false;
let closeOpenLayers=false;

function openClose(type){
    switch (type) {
      case "navbar":
        if (closeOpenNavbar){
            closeOpenNavbar = false;
            closeNav();
        } else{
            closeOpenNavbar = true;
            openNav();
        }
      break;
      case "layers":
        var element = document.getElementById("inputsLayers");
        if (closeOpenLayers){
          closeOpenLayers = false;
          element.classList.add("display-none");
      } else{
          closeOpenLayers = true;
          element.classList.remove("display-none");
      }
      break;
    }
}

function openNav() {
  document.getElementById("mainMenuContainer").style.width = "auto";
  document.getElementById("mainMenuContainer").style.backgroundColor = "white";
}

function closeNav() {
  document.getElementById("mainMenuContainer").style.width = "0";
  var mapElement = document.getElementsByClassName("map")[0];
  mapElement.classList.remove("width-80");
}

document.getElementById("menuLeft").addEventListener("click", openClose.bind(this, "navbar"),false);
document.getElementById("menuLeftBaseLayers").addEventListener("click", openClose.bind(this, "layers"),false); 