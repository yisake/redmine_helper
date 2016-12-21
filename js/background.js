chrome.browserAction.onClicked.addListener(function() {
	alert("插件打开");
});
/*chrome.runtime.onMessage.addListener(
		
		  function(request, sender, sendResponse) {
			  var dataUrl;
			  console.log(sender.tab ?
		                "from a content script:" + sender.tab.url :
		                "from the extension");
		    html2canvas(
		    		document.body, 
		    {
		    allowTaint: true,
		    taintTest: false,
		    onrendered: function(canvas) {
		        canvas.id = "mycanvas";
		        //document.body.appendChild(canvas);
		        //生成base64图片数据
		       dataUrl= canvas.toDataURL();
		          
		    }
		    });
		    sendResponse({kw: dataUrl});  
		  });*/
		  