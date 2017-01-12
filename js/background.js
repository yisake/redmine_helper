jQuery(document).ready(function($){
	
	//URL获取参数
    login=getQueryString("login");
	password=getQueryString("password");
	projectid=getQueryString("projectid");
	projectname=getQueryString("projectname");
	track=getQueryString("track");
	subject=getQueryString("subject");
	description=getQueryString("description");
	priority=getQueryString("priority");
	severity=getQueryString("severity");
	reappear=getQueryString("reappear");
	type=getQueryString("type");
	environment=getQueryString("environment");
	assigneeid=getQueryString("assigneeid");
	assigneename=getQueryString("assigneename");
	
	
	//URL获取img图像，getQueryString方法
	var img=new Image();
	img.src=getQueryString("img");
	//从img读取图像并绘图到canvas
	var ctx=document.getElementById('canvasView');
	document.getElementById("canvasView").setAttribute("width",img.width);
	document.getElementById("canvasView").setAttribute("height",img.height);
	var ctx2d=ctx.getContext("2d");
	ctx2d.drawImage(img,0,0);		
	
    x=new FaplCanvas('canvasView');
    FaplCanvas.prototype.undoListener = function(){
        var $ele = $("[data-toggle='undo'].canvas-helper");
        if(this.undoImages.length == 0){
            $ele.attr('disabled',true); 
        }else{
            $ele.attr('disabled',false);
        }
    };
    
    FaplCanvas.prototype.redoListener = function(){
        var $ele = $("[data-toggle='redo'].canvas-helper");
        if(this.redoImages.length == 0){
            $ele.attr('disabled',true); 
        }else{
            $ele.attr('disabled',false);
        }
    };
    
    // trigger at beginning
    x.undoListener();
    x.redoListener();
    
    
    // binding icon behaviour
    $('.canvas-icon').click(function(){
        $('.canvas-icon').removeClass('btn-success');
        $(this).addClass('btn-success');
        x.setTool($(this).attr('data-toggle'));
    });

    //set default data toggle
    $('.canvas-icon').each(function(index){
        if($(this).hasClass('default-tool'))
            $(this).click();
    });

    
    $('.canvas-helper').click(function(){
       if($(this).attr('data-toggle') == 'undo'){
            x.undoStep();
        }else{
            x.redoStep();
        }
    });    
});

//点击submit时提交bug到redmine
$(document).ready(function() {
	$('#submit').click(function(){
		var canvas = $("#canvasView")[0];
	    var screenshotUrl=canvas.toDataURL("image/jpeg", 1.0);
	    //正则匹配替换掉前面的字符
	    var Pic = screenshotUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
	    //console.log(Pic)
	    //构建上传的formdata
		$("#registerForm").attr("enctype","multipart/form-data");
		var formData = new FormData($("#registerForm")[0]);
		formData.append("imgBase64",encodeURIComponent(Pic));//
		formData.append("fileFileName","chrome.png");
		formData.append("login",login);
		formData.append("password",password);
		//上传 自动截图
		$.ajax({
	        url: "http://127.0.0.1:5000/upload",
	        type: 'POST',  
	        data: formData,
	        timeout : 10000, //超时时间设置，单位毫秒
	        alocal: true,  
	        cache: false,  
	        contentType: false,  
	        processData: false, 
            beforeSend:function(){
                $('#fakeloader5').css('display','block');
            },
	        success: function (data, textStatus, xhr) {
	        	//问题提交
	        	$.ajax({
	    			url:"http://127.0.0.1:5000/createIssue",
	    			type:"POST", 
	    			dataType:"json",
	    			data:{
	    				"login":login,
	    				"password":password,
	    				"projectid":projectid,
	    				"track":track,
	    				"subject":subject,
	    				"description":description,
	    				"priority":priority,
	    				"severity":severity,
	    				"reappear":reappear,
	    				"type":type,
	    				"environment":environment,
	    				"assigneeid":assigneeid,
	    			},
	                beforeSend:function(){
	                    $('#fakeloader5').css('display','block')
	                },
	    		    success: function (data, textStatus, xhr) {
	    		    	$('#fakeloader5').css('display','none')
	    		    	//问题提交成功后相关信息的销毁和重置
	    		    	localStorage.removeItem("lastuser");
	    		    	localStorage.setItem("lastuser",assigneeid);
	    		    	localStorage.removeItem("lastproject");
	    		    	localStorage.setItem("lastproject",projectid);
	    		    	if(data.result=="success"){
	    		    		ShowSuccess("提交bug成功");
	    		    	}else{
	    		    		ShowDanger("提交bug失败");
	    		    	}
	    			},
	    			error:function(XMLHttpRequest, textStatus, errorThrown){
	    				//问题提交失败后相关信息的销毁和重置
	    				localStorage.removeItem("lastuser");
	    		    	localStorage.setItem("lastuser",assigneeid);
	    		    	localStorage.removeItem("lastproject");
	    		    	localStorage.setItem("lastproject",projectid);
	    				
	    		    	ShowDanger("提交bug 请求发生错误")
	    		    	console.log(XMLHttpRequest);
	    				console.log(errorThrown);
	    			},
	        	});
	       	},  
	        error: function (XMLHttpRequest, textStatus, errorThrown){
	        ShowDanger("上传附件失败");
			console.log(XMLHttpRequest);
			console.log(errorThrown);
	        },
		});
		$('#fakeloader5').css('display','none');
	});
});


//通话URL获取参数方法
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null){
		return decodeURI(r[2]);
	}
	return null; 
};

//tip是提示信息，type:'success'是成功信息，'danger'是失败信息,'info'是普通信息
function ShowTip(tip, type) {
    var $tip = $('#tip');
    if ($tip.length == 0) {
        $tip = $('<span id="tip" style="font-weight:bold;position:absolute;top:50px;left: 50%;z-index:9999"></span>');
        $('body').append($tip);
    }
    $tip.stop(true).attr('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(500).delay(1000).fadeOut(500);
}

function ShowMsg(msg) {
    ShowTip(msg, 'info');
}

function ShowSuccess(msg) {
    ShowTip(msg, 'success');
}

function ShowDanger(msg) {
    ShowTip(msg, 'danger');
}

function ShowWarn(msg,$focus, clear) {
    ShowTip(msg, 'warning');
    if ($focus) $focus.focus();
    if (clear) $focus.val('');
    return false;
}