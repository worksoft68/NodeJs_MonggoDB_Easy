var notifyMasterIsOpen = false;
var secondMasterIsOpen = 0;
var cursorX = 0;
var cursorY = 0;
var runingAutoCloseNotifyMaster;
document.addEventListener('click', printMousePos, true);
function printMousePos(e){

      cursorX = e.pageX;
      cursorY= e.pageY;
      changeNotifyLocation(cursorX, (cursorY-40));
      
     // alert(cursorX + ':'+cursorY);
     // $( "#test" ).text( "pageX: " + cursorX +",pageY: " + cursorY );
}

function changeNotifyLocation(x,y) {
    var domElement = document.getElementById('divNotifyPopup');// don't go to to DOM every time you need it. Instead store in a variable and manipulate.
    domElement.style.position = "absolute";
    domElement.style.top = y+"px"; //or whatever 
    domElement.style.left = x+"px"; // or whatever
  }



  RemoveClassAndHidden('DivNotifyMaster','');
  var runingAutoCloseNotifyMaster = setInterval(function () {
    autoCloseNotifyMaster() 
        }, 1000
    );
  function autoCloseNotifyMaster() {
    if (notifyMasterIsOpen == true) {       
        secondMasterIsOpen += 1;               
    }
    else
    {
        secondMasterIsOpen = 0;
    }

    if (secondMasterIsOpen >= 3) { 
        notifyMasterIsOpen = false;
        secondMasterIsOpen = 0;

       // clearInterval(runingAutoCloseNotifyMaster);    
        RemoveClassAndHidden('DivNotifyMaster', '');
        hiddenPopup();
        
    }
}

function showNotifyMaster(notifyContent) {
    // runingAutoCloseNotifyMaster = setInterval(function () {
    //     autoCloseNotifyMaster() 
    //         }, 2000
    //     );

    var controlId = document.getElementById('DivNotifyMaster');
    controlId.hidden = false;
    $("#divContentNotifyMaster").html(notifyContent);
    notifyMasterIsOpen = true;
    secondMasterIsOpen = 0;
}


function RemoveClass(MyControl, MyClass) {
    var controlId = document.getElementById(MyControl);
    var classContent = controlId.className;
    controlId.className = classContent.replace(MyClass, "").trim();
}
function AddClass(MyControl, MyClass) {
    MyClassNew = ' ' + MyClass;
    var controlId = document.getElementById(MyControl);
    if (controlId) {
        controlId.className += controlId.className ? MyClassNew : MyClass;
    }
}

function hiddenControl(MyControl) {
    var controlId = document.getElementById(MyControl);    
    controlId.hidden = true;
}

function RemoveClassAndHidden(MyControl, MyClass) {
    var controlId = document.getElementById(MyControl);
    var classContent = controlId.className;
    controlId.className = classContent.replace(MyClass, "").trim();
    controlId.hidden = true;
}

function RemoveClassAndShow(MyControl, MyClass) {
    var controlId = document.getElementById(MyControl);
    var classContent = controlId.className;
    controlId.className = classContent.replace(MyClass, "").trim();
    controlId.hidden = false;
}
function AddClassAndShow(MyControl, MyClass) {
   // MyClassNew = MyClassNew.replace(MyClassNew, MyClass);
    MyClassNew = ' ' + MyClass;

    var controlId = document.getElementById(MyControl);
    if (controlId) {
        var classContent = controlId.className;
        controlId.className = classContent.replace(MyClass, "").trim();
        controlId.className += controlId.className ? MyClassNew : MyClass;
    }
    controlId.hidden = false;
    //var classContent = controlId.className;
    //controlId.className = MyClass;
    //controlId.hidden = false;
}


function showPopup(message, result = '') {   
    let img = '';
    if(result=="success") {
        img = "<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==\">";
    }
    message = img+message+" &nbsp;<img onclick=\"hiddenPopup();\"  src=\"img/Close-icon.png\" width=\"22px\"/>"
    var popup = document.getElementById("divPopupContent");
    popup.innerHTML = message;   
    popup.className += popup.className ? " show" : show;
    //popup.classList.toggle("show");
  }
function hiddenPopup() {
    var popup = document.getElementById("divPopupContent");
    popup.classList.remove("show");
  }