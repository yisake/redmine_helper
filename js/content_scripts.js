/*var greeting = "hola, ";
var button = document.getElementById("mybutton");
button.person_name = "Roberto";
button.addEventListener("click", function() {
  alert(greeting + button.person_name + ".");
}, false);*/
/*var button = document.getElementById("su");
button.addEventListener("click", function() {
  alert("chenggongzhuru");
}, false);
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse,event) {
	  var dataUrl;
    if (request.cmd == "getdom"){
    	console.dir(document);
    	console.dir(document.body);
    	html2canvas(
    			document.body, 
	    {
	    allowTaint: true,
	    taintTest: false,
	    useCORS:true,
	    onrendered: function(canvas) {
	    	canvas.id = "mycanvas";
	    	console.log(canvas);
	    	console.log(canvas.id);
	    	dataUrl=canvas.toDataURL();
	    }
	    });
    	
      sendResponse({kw: dataUrl});
    }else{
      sendResponse({kw: "contentjs"}); // snub them.
    }
  });*/

