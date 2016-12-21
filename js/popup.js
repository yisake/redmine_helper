/*var button = document.getElementById("login");
button.addEventListener("click", function() {
	document.getElementById("username1").value="4444";
	chrome.tabs.getSelected(null, function(tab) {
		var myTabUrl = tab.url; 
		document.getElementById("username1").value=myTabUrl;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://10.12.21.161:8080/AutoTest/manage/GetAllPosition", true);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    // JSON解析器不会执行攻击者设计的脚本.
		    var resp = JSON.parse(xhr.responseText);
		    alert(resp[0].name);
		  }
		}
		xhr.send();

		$.ajax({
			url:"http://10.12.21.161:8080/AutoTest/manage/GetAllPosition",
			type:"POST", 
			async: false,
			dataType:"json",
		    success: function (data, textStatus, xhr) {
		    	alert(data[0].name);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(errorThrown);
			}

		});	
	});
}, false);
function setScreenshotUrl(url) {
	  document.getElementById('target').src = url;
	}*/

    var map=new Map();
    $(document).on('ready', function() {
    	
    	//从localStorage中取数 赋值 初始化
    	document.getElementById("username").value=localStorage.getItem("redmineusername");
    	document.getElementById("password").value=localStorage.getItem("redminepassword");
    	document.getElementById("projectview").value=localStorage.getItem("projectview");
    	 $('#projectconfig').multiselect('destroy');
    	//常用项目已选择的map初始化
    	 var mapstring=localStorage.getItem("projectmap");
    	 if(mapstring!=null){
    		 var mapstrings=[];
    		 mapstrings=mapstring.split(";");
    		 for(var i=0;i<mapstrings.length;i++){
    			 map.put(mapstrings[i].split(",")[0],mapstrings[i].split(",")[1]);
    		 };
    	 }
    	 //project 下拉选项初始化  并选择上次选择的project作为默认值
    	 $('#project').html("");
    	 var lastproject=localStorage.getItem("lastproject");
    	 if(lastproject==null){
    		 if(map.size()>0){
        		 for (var i = 0, keys = map.keySet(), len = keys.length; i< len; i++) {
        			 $('#project').append("<option value="+keys[i]+" >"+map.get(keys[i])+"</option>");		
        		 }
        	 }	 
    	 }else{
    		 if(map.size()>0){
        		 for (var i = 0, keys = map.keySet(), len = keys.length; i< len; i++) {
        			 if(keys[i]==lastproject){
        				 $('#project').append("<option value="+keys[i]+" selected>"+map.get(keys[i])+"</option>");	 
        			 }else{
        				 $('#project').append("<option value="+keys[i]+" >"+map.get(keys[i])+"</option>");
        			 }
        		 }
        	 }
    	 }
    	 
    	//上传附件插件初始化
    		$("#attachment").fileinput({
    			   language: "zh",
    			   showPreview: false,
    		       allowedFileExtensions: ["txt","pdf","html","xml","doc","docx","xlsx","xls","csv","zip","rar","jpg","gif","bmp","png","mmap"],
    		        uploadUrl: 'http://10.12.21.161:8080/AutoTest/chrome/upload',
    		        uploadAsync: false,
    		        showUpload: true,
    		        showRemove: true,
    	            maxFileCount: 3,
    		        maxFileSize: 4096,
    		       elErrorContainer: "#errorBlock",
    		       uploadExtraData:{
     	        	  "login":localStorage.getItem("redmineusername"),
     	        	  "password":localStorage.getItem("redminepassword")
     	        	 }  
    		    }).on('fileuploaded', function(event, data, id, index) {
    		    	document.getElementById("attachlist").value=data.response;
    		    }).on('filebatchuploadsuccess', function(event, data) {
    		    	document.getElementById("attachlist").value=data.response;
    		    }).on('fileselect', function(event, numFiles, label) {
    		    	if(document.getElementById("username").value==""||document.getElementById("password").value==""){
    		    		$.jGrowl("配置信息不能为空！", { header: 'Warning Tip' });
    		    	}    
    		    });
    	$("#attachment").fileinput('disable');
      //指派人初始化
    	if(document.getElementById("project").value!=null&&document.getElementById("project").value!=""){
    		var lastuser=localStorage.getItem("lastuser");
    		$.ajax({
    			url:"http://10.12.21.161:8080/AutoTest/chrome/user",
    			type:"POST", 
    			async: false,
    			dataType:"json",
    			data:{
    				projectkey:document.getElementById("project").value
    			},
    		    success: function (data, textStatus, xhr) {
    		    	console.dir(data);
    		    	if(data!=null&&data.length>0){
    		    		$('#questionfor').html("");
    		    		for(var i=0;i<data.length;i++){
    		    			if(typeof(lastuser)!="undefined"&&lastuser!=data[i].id){
    		    				$('#questionfor').append("<option value="+data[i].userid+" >"+data[i].username+"</option>");	
    		    			}else if(typeof(lastuser)!="undefined"){
    		    				$('#questionfor').append("<option value="+data[i].userid+" selected>"+data[i].username+"</option>");
    		    			}
    		        	}	
    		    	}
    			},
    			error:function(XMLHttpRequest, textStatus, errorThrown){
    				console.log(XMLHttpRequest);
    				console.log(errorThrown);
    			}
        	});
    	}
    });
    //修改使用自动截图还是上传附件
    $('#capture').change(function(){
    	if(document.getElementById("capture").value=="自动截图"||document.getElementById("capture").value=="无附件"){
    		document.getElementsByClassName("fileinput-remove-button")[0].click();
    		$("#attachment").fileinput('disable');
    		document.getElementById("attachlist").value="";
    	}else{
    		$("#attachment").fileinput('enable');
    	}
    });
    //项目变更 修改对应指派人
    $('#project').change(function(){
    	if(document.getElementById("project").value!=null&&document.getElementById("project").value!=""){
    		var lastuser=localStorage.getItem("lastuser");
    		$.ajax({
    			url:"http://10.12.21.161:8080/AutoTest/chrome/user",
    			type:"GET", 
    			async: false,
    			dataType:"json",
    			data:{
    				"projectkey":document.getElementById("project").value
    			},
    		    success: function (data, textStatus, xhr) {
    		    	if(data!=null&&data.length>0){
    		    		$('#questionfor').html("");
    		    		for(var i=0;i<data.length;i++){
    		    			if(typeof(lastuser)!="undefined"&&lastuser!=data[i].id){
    		    				$('#questionfor').append("<option value="+data[i].userid+" >"+data[i].username+"</option>");	
    		    			}else if(typeof(lastuser)!="undefined"){
    		    				$('#questionfor').append("<option value="+data[i].userid+" selected>"+data[i].username+"</option>");
    		    			}
    		        	}	
    		    	}
    			},
    			error:function(XMLHttpRequest, textStatus, errorThrown){
    				console.log(XMLHttpRequest);
    				console.log(errorThrown);
    			}
        	});
    	}
    });
    //修改配置按钮
    $('#editconfig').click(function(){
    	//去掉用户名密码输入框的只读属性
    	document.getElementById("username").removeAttribute("readonly");
    	document.getElementById("password").removeAttribute("readonly");
    	
    	//项目数据读取  并初始化项目下拉列表 包含初始化已选择数据
    	$.ajax({
			url:"http://10.12.21.161:8080/AutoTest/chrome/project",
			type:"GET", 
			async: false,
			dataType:"json",
		    success: function (data, textStatus, xhr) {
		    	console.dir(data);
		    	if(data!=null&&data.length>0){
		    		$('#projectconfig').html("");
		    		for(var i=0;i<data.length;i++){
		    			if(typeof(map.get(data[i].id))=="undefined"){
		    				$('#projectconfig').append("<option value="+data[i].id+" >"+data[i].name+"</option>");	
		    			}else{
		    				$('#projectconfig').append("<option value="+data[i].id+" selected>"+data[i].name+"</option>");
		    			}
		        	}	
		    	}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				console.log(XMLHttpRequest);
				console.log(errorThrown);
			}
    	});
    	//隐藏项目展示输入框  初始化项目选择框
    	document.getElementById("projectview").setAttribute("style","display:none;");
    	$('#projectconfig').multiselect({
    		maxHeight: 400,
    		enableFiltering: true,
            //includeSelectAllOption: true,
            buttonWidth: '236px',
            dropRight: true,
            onChange: function(option, checked, select) {
            	if(checked){
            		if(typeof(map.get($(option).val()))=="undefined"){
                		map.put($(option).val(),$(option).text());	
                	}	
            	}else{
            		if(typeof(map.get($(option).val()))!="undefined"){
                		map.remove($(option).val());	
                	}
            	}
            }
    	});	
    	//常用项目配置 多选下拉框宽度设置
    	document.getElementsByClassName("multiselect-container")[0].setAttribute("style","width:236px;")
    });
    //保存配置按钮
    $('#saveconfig').click(function(){
    	//用户名 密码 保存到localStorage
    	localStorage.setItem("redmineusername",document.getElementById("username").value);
    	localStorage.setItem("redminepassword",document.getElementById("password").value);
    	//用户名 密码 输入框置为只读
    	document.getElementById("username").setAttribute("readonly","true");
    	document.getElementById("password").setAttribute("readonly","true");
    	//常用项目map和view存储到 localStorage
    	localStorage.removeItem("projectmap");
    	localStorage.removeItem("projectview");
    	localStorage.setItem("projectmap",map.valuetoString());
    	localStorage.setItem("projectview",document.getElementsByClassName("multiselect")[0].getAttribute("title"));
    	//常用项目选择框置为不可用
    	$('#projectconfig').multiselect('destroy');
    	//将常用项目显示框置为可见
    	document.getElementById("projectview").setAttribute("style","display:block;");
    	document.getElementById("projectview").value=localStorage.getItem("projectview");
    	//根据选择的常用项目 修改问题信息中项目选择列表  并选择最后一次选择的项目作为默认值
    	$('#project').html("");
	   	 var lastproject=localStorage.getItem("lastproject");
	   	 if(lastproject==null){
	   		 if(map.size()>0){
	       		 for (var i = 0, keys = map.keySet(), len = keys.length; i< len; i++) {
	       			 $('#project').append("<option value="+keys[i]+" >"+map.get(keys[i])+"</option>");		
	       		 }
	       	 }	 
	   	 }else{
	   		 if(map.size()>0){
	       		 for (var i = 0, keys = map.keySet(), len = keys.length; i< len; i++) {
	       			 if(keys[i]==lastproject){
	       				 $('#project').append("<option value="+keys[i]+" >"+map.get(keys[i])+"</option>");	 
	       			 }else{
	       				 $('#project').append("<option value="+keys[i]+" selected>"+map.get(keys[i])+"</option>");
	       			 }
	       		 }
	       	 }
	   	 };
	   	 //根据项目修改指派人为对应项目的人员 并将最后一次选择的指派人置为默认值
	   	 if(document.getElementById("project").value!=""){
	   		var lastuser=localStorage.getItem("lastuser");
    		$.ajax({
    			url:"http://10.12.21.161:8080/AutoTest/chrome/user",
    			type:"POST", 
    			async: false,
    			dataType:"json",
    			data:{
    				projectkey:document.getElementById("project").value
    			},
    		    success: function (data, textStatus, xhr) {
    		    	if(data!=null&&data.length>0){
    		    		$('#questionfor').html("");
    		    		for(var i=0;i<data.length;i++){
    		    			if(typeof(lastuser)!="undefined"&&lastuser!=data[i].id){
    		    				$('#questionfor').append("<option value="+data[i].userid+" >"+data[i].username+"</option>");	
    		    			}else if(typeof(lastuser)!="undefined"){
    		    				$('#questionfor').append("<option value="+data[i].userid+" selected>"+data[i].username+"</option>");
    		    			}
    		        	}	
    		    	}
    			},
    			error:function(XMLHttpRequest, textStatus, errorThrown){
    				console.log(XMLHttpRequest);
    				console.log(errorThrown);
    			}
        	});
	   	 }
    });
    //提交按钮
    $('#sub').click(function(){
    	//提交信息  参数
    	var login=document.getElementById("username").value;
    	var password=document.getElementById("password").value;
    	var projectid=document.getElementById("project").value;
    	var projectname=$('#project option:selected').text();
    	var track=document.getElementById("track").value;
    	var subject=document.getElementById("subject").value;
    	var description=document.getElementById("note").value;
    	var priority=document.getElementById("priority").value;
    	var severity=document.getElementById("severity").value;
    	var reappear=document.getElementById("reappear").value;
    	var type=document.getElementById("type").value;
    	var environment=document.getElementById("environment").value;
    	var assigneeid=document.getElementById("questionfor").value;
    	var assigneename=$('#questionfor option:selected').text();
    	var attachlist=document.getElementById("attachlist").value;
    	
    	//提交信息满足提交条件
        if(login!=null&&login!=""&&password!=null&&password!=""&&subject!=null&&subject!=""&&projectid!=null&&projectid!=""&&assigneeid!=null&&assigneeid!=""){
        	//如果是自动截图 则进行截图及上传操作
        	if(document.getElementById("capture").value=="自动截图"){
        	chrome.tabs.captureVisibleTab(function(screenshotUrl) {
        		//构建上传的formdata
        		$("#registerForm").attr("enctype","multipart/form-data");
        		var formData = new FormData($("#registerForm")[0]);
        		formData.append("imgBase64",encodeURIComponent(screenshotUrl));//
        		formData.append("fileFileName","photo.jpg");
        		formData.append("login",localStorage.getItem("redmineusername"));
        		formData.append("password",localStorage.getItem("redminepassword"));
        		//上传 自动截图
        		$.ajax({  
        	        url: "http://10.12.21.161:8080/AutoTest/chrome/capture",
        	        type: 'POST',  
        	        data: formData,  
        	        timeout : 10000, //超时时间设置，单位毫秒
        	        async: true,  
        	        cache: false,  
        	        contentType: false,  
        	        processData: false, 
        	        success: function (data, textStatus, xhr) {
        	        	//返回值获取 附件token
        	        	attachlist=data.substring(1,data.length-1);
        	        	//问题提交
        	        	$.ajax({
        	    			url:"http://10.12.21.161:8080/AutoTest/chrome/newissue",
        	    			type:"POST", 
        	    			async: false,
        	    			dataType:"json",
        	    			data:{
        	    				"login":login,
        	    				"password":password,
        	    				"projectid":projectid,
        	    				"projectname":projectname,
        	    				"track":track,
        	    				"subject":subject,
        	    				"description":description,
        	    				"priority":priority,
        	    				"severity":severity,
        	    				"reappear":reappear,
        	    				"type":type,
        	    				"environment":environment,
        	    				"assigneeid":assigneeid,
        	    				"assigneename":assigneename,
        	    				"attachlist":attachlist
        	    			},
        	    		    success: function (data, textStatus, xhr) {
        	    		    	//问题提交成功后相关信息的销毁和重置
        	    		    	document.getElementById("attachlist").value="";
        	    		    	localStorage.removeItem("lastuser");
        	    		    	localStorage.setItem("lastuser",document.getElementById("questionfor").value);
        	    		    	localStorage.removeItem("lastproject");
        	    		    	localStorage.setItem("lastproject",document.getElementById("project").value);
        	    		    	if(data=="success"){
        	    		    		$.jGrowl("BUG提交成功~", { header: 'Operating Result' });	
        	    		    	}else{
        	    		    		$.jGrowl("BUG提交失败！", { header: 'Operating Result' });
        	    		    	}
        	    			},
        	    			error:function(XMLHttpRequest, textStatus, errorThrown){
        	    				//问题提交失败后相关信息的销毁和重置
        	    				document.getElementById("attachlist").value="";
        	    				localStorage.removeItem("lastuser");
        	    		    	localStorage.setItem("lastuser",document.getElementById("questionfor").value);
        	    		    	localStorage.removeItem("lastproject");
        	    		    	localStorage.setItem("lastproject",document.getElementById("project").value);
        	    		    	$.jGrowl("BUG提交失败："+errorThrown, { header: 'Operating Result' });
        	    		    	console.log(XMLHttpRequest);
        	    				console.log(errorThrown);
        	    			}
        	        	});
        	       	},  
        	        error: function (XMLHttpRequest, textStatus, errorThrown){
        			console.log(XMLHttpRequest);
        			console.log(errorThrown);
        	        }
         		});
        	});
        	}else{
        		//上传附件或者无附件方式的问题提交
        		$.ajax({
        			url:"http://10.12.21.161:8080/AutoTest/chrome/newissue",
        			type:"POST", 
        			async: false,
        			dataType:"json",
        			data:{
        				"login":login,
        				"password":password,
        				"projectid":projectid,
        				"projectname":projectname,
        				"track":track,
        				"subject":subject,
        				"description":description,
        				"priority":priority,
        				"severity":severity,
        				"reappear":reappear,
        				"type":type,
        				"environment":environment,
        				"assigneeid":assigneeid,
        				"assigneename":assigneename,
        				"attachlist":attachlist
        			},
        		    success: function (data, textStatus, xhr) {
        		    	//问题提交成功后信息的销毁和重置
        		    	document.getElementById("attachlist").value="";
        		    	localStorage.removeItem("lastuser");
        		    	localStorage.setItem("lastuser",document.getElementById("questionfor").value);
        		    	localStorage.removeItem("lastproject");
        		    	localStorage.setItem("lastproject",document.getElementById("project").value);
        		    	if(data=="success"){
        		    		$.jGrowl("BUG提交成功~", { header: 'Operating Result' });	
        		    	}else{
        		    		$.jGrowl("BUG提交失败！", { header: 'Operating Result' });
        		    	}
        		    	
        			},
        			error:function(XMLHttpRequest, textStatus, errorThrown){
        				//问题提交失败后信息的销毁和重置
        				document.getElementById("attachlist").value="";
        				localStorage.removeItem("lastuser");
        		    	localStorage.setItem("lastuser",document.getElementById("questionfor").value);
        		    	localStorage.removeItem("lastproject");
        		    	localStorage.setItem("lastproject",document.getElementById("project").value);
        				console.log(XMLHttpRequest);
        				console.log(errorThrown);
        				$.jGrowl("BUG提交失败："+errorThrown, { header: 'Operating Result' });
        			}
            	});
        	}

        	
    	}else if(login==null||login==""){
    		 $.jGrowl("配置信息中登录用户名不能为空！", { header: 'Warning Tip' });
    	}else if(password==null||password==""){
    		 $.jGrowl("配置信息中密码不能为空！", { header: 'Warning Tip' });
    	}else if(subject==null||subject==""){
    		 $.jGrowl("主题不能为空！", { header: 'Warning Tip' });
    	}else if(projectid==null||projectid==""){
    		 $.jGrowl("项目不能为空！", { header: 'Warning Tip' });
    	}else if(assigneeid==null||assigneeid==""){
    		 $.jGrowl("指派人不能为空！", { header: 'Warning Tip' });
    	}
    	
    });
    //翻滚吧页面  翻滚效果配置
    $(".sample").turnBox({  
    	  width: 200,  
    	  height: 50,  
    	  axis: "Y",  
    	   
    	  perspective: 800,  
    	  duration: 200,  
    	  delay: 0,  
    	  easing: "linear",  
    	  direction: "positive",  
    	  type: "real" 
    	}); 
    //bug提交页面切换按钮点击
    $('#subtabbtn').turnBoxLink({
    	  box:$(".sample"),
    	  events: "click",
    	  dist: "next"
    	});
    //bug提交页面切换按钮点击  切换按钮显示
    $('#subtabbtn').click(function(){
    	document.getElementById("subtabbtn").setAttribute("style","display:none;");
    	document.getElementById("configtabbtn").setAttribute("style","display:block;");
    });
    //配置页面切换按钮点击
    $('#configtabbtn').turnBoxLink({
  	  box:$(".sample"),
  	  events: "click",
  	  dist: "prev"
  	});
    //配置页面切换按钮点击  切换按钮显示
    $('#configtabbtn').click(function(){
    	document.getElementById("configtabbtn").setAttribute("style","display:none;");
    	document.getElementById("subtabbtn").setAttribute("style","display:block;");	
    });
    
    /*$(function(){
    	$("#project").click(
    			function(){
    				$.ajax({
    					url:"http://10.12.21.161:8080/AutoTest/chrome/project",
    					type:"POST", 
    					async: false,
    					dataType:"json",
    				    success: function (data, textStatus, xhr) {
    				    	if(data!=null&&data.length>0){
    				    		$('#project').append("<option></option>");
    				    		for(var i=0;i<data.length;i++){
    				        		$('#project').append("<option>"+data[i].name+"</option>");
    				        	}	
    				    	}else{
    				    		//$.jGrowl("没有符合条件的项目供选择！", { header: 'Warning Tip' });
    				    	}
    					},
    					error:function(XMLHttpRequest, textStatus, errorThrown){
    						console.log(XMLHttpRequest);
    						console.log(errorThrown);
    						//$.jGrowl("项目获取失败，请与管理员联系！", { header: 'Warning Tip' });
    					}
    		    	});			
    			});
    	
    });*/
    function Map(){
		this.container = new Object();
		}


		Map.prototype.put = function(key, value){
		this.container[key] = value;
		}


		Map.prototype.get = function(key){
		return this.container[key];
		}


		Map.prototype.keySet = function() {
		var keyset = new Array();
		var count = 0;
		for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend') {
		continue;
		}
		keyset[count] = key;
		count++;
		}
		return keyset;
		}


		Map.prototype.size = function() {
		var count = 0;
		for (var key in this.container) {
		// 跳过object的extend函数
		if (key == 'extend'){
		continue;
		}
		count++;
		}
		return count;
		}


		Map.prototype.remove = function(key) {
		delete this.container[key];
		}
		
		Map.prototype.valuetoString = function(){
			var str = "";
			for (var i = 0, keys = this.keySet(), len = keys.length; i< len; i++) {
				str = str + keys[i] + "," + this.container[keys[i]] + ";";
			}
			if(str!=""){
				str=str.substring(0,str.length-1);
			}
			return str;
			}

		Map.prototype.toString = function(){
		var str = "";
		for (var i = 0, keys = this.keySet(), len = keys.length; i< len; i++) {
		str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
		}
		return str;
		}
