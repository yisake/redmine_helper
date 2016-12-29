var map=new Map();

/* commit by:chunfeng
$(document).ready(function() {
    $.ajax({
        type:'get',
        async:false,
        url:"http://127.0.0.1:5000/getAllProjects",
        timeout:20000,
        success:function(data,status){
          alert("数据：" + data + "\n状态：" + status);
        },
    });
    var user=localStorage.getItem("redmineusername");
    var pwd=localStorage.getItem("redminepassword");
    if (user!=null) {
        $("#username").text(user);
        $("#password").text(pwd);
    }    
});
*/

$(document).ready(function() {
    $("#loginButton").click(function() {
        //console.log($("#projectview").attr("display"));
        //console.log(document.getElementById('projectview').getAttribute('display'));
        //console.log($('#projectview').css('display'));
        //如果projectview为空(localstorage中为空)或者projectconfig视图下projectconfig为null(相当于视图未选择)
        if (($('#projectview').val()=="")||($('#projectconfig').val()==null&&$('#projectview').css('display')=='none')) {
            //alert("请先收藏常用项目")
            $.jGrowl("请先收藏常用项目", { header: 'Operating Result' });
            return
        }
        $.ajax({
            type:'post',
            //async: false,
            url:'http://127.0.0.1:5000/login',
            data:{
                "username":document.getElementById("username").value,
                "password":document.getElementById("password").value,
            },
            dataType:"json",
            timeout:20000,
            beforeSend:function(){
                $('#fakeloader1').css('display','block')
              
            },
            success:function(data,status){
                //alert("数据：" + data + "\n状态：" + status);
                console.log("数据：" + data + "\n状态：" + status)
                //var oldNode=document.getElementById('fakeloader');
                //oldNode.parentNode.replaceChild(container,oldNode);
                $('#fakeloader1').css('display','none')
                console.dir(data)
                //console.log(data)
                if (data.result=='y') {
                    $("#subtabbtn").click();
                    localStorage.setItem("redmineusername",document.getElementById("username").value);
                    localStorage.setItem("redminepassword",document.getElementById("password").value);
                    console.log(map)
                    localStorage.setItem("projectmap",map.valuetoString());
                    localStorage.setItem("projectview",document.getElementsByClassName("multiselect")[0].getAttribute("title"));
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
                } else {
                    //alert('username/password is wrong')
                    $.jGrowl("用户名或者密码错误", { header: 'Operating Result' });
                }
            },
        })
  });
});

//$(document).ready(function(){
$("#editconfig").click(function() {
    //项目数据读取  并初始化项目下拉列表 包含初始化已选择数据
    $.ajax({
        url:"http://127.0.0.1:5000/getAllProjects",
        timeout:20000,
        type:"GET", 
        async: false,
        dataType:"json",
        success: function (data, textStatus, xhr) {
            console.dir(data);
            if(data!=null&&data.length>0){
                $('#projectconfig').html("");
                for(var i=0;i<data.length;i++){
                    //console.log(data[i].project_id)
                    //console.log(data[i].project_name)
                    if(typeof(map.get(data[i].project_id))=="undefined"){
                        $('#projectconfig').append("<option value="+data[i].project_id+" >"+data[i].project_name+"</option>");
                        //console.log('append 1')
                    }else{
                        $('#projectconfig').append("<option value="+data[i].project_id+" selected>"+data[i].project_name+"</option>");
                        //console.log('append 2')
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
    
    console.dir(map)
    
    //常用项目map和view存储到 localStorage
    localStorage.removeItem("projectmap");
    localStorage.removeItem("projectview");
    localStorage.setItem("projectmap",map.valuetoString());
    localStorage.setItem("projectview",document.getElementsByClassName("multiselect")[0].getAttribute("title"));
    
    //常用项目配置 多选下拉框宽度设置
    document.getElementsByClassName("multiselect-container")[0].setAttribute("style","width:236px;")
});


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
            uploadUrl: 'http://127.0.0.1:5000/upload',
            uploadAsync: false,
            showUpload: true,
            showRemove: true,
            maxFileCount: 3,
            maxFileSize: 4096,
            elErrorContainer: "#errorBlock",
            uploadExtraData:{
              "username":localStorage.getItem("redmineusername"),
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
            url:"http://127.0.0.1:5000/getProjectMembers",
            type:"POST", 
            dataType:"json",
            data:{
                projectid:document.getElementById("project").value
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

//项目变更 修改对应指派人
$('#project').change(function(){
    if(document.getElementById("project").value!=null&&document.getElementById("project").value!=""){
        var lastuser=localStorage.getItem("lastuser");
        $.ajax({
            url:"http://127.0.0.1:5000/getProjectMembers",
            type:"POST", 
            async: false,
            dataType:"json",
            data:{
                projectid:document.getElementById("project").value
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
    
    //提交信息满足提交条件
    if(login!=null&&login!=""&&password!=null&&password!=""&&subject!=null&&subject!=""&&projectid!=null&&projectid!=""&&assigneeid!=null&&assigneeid!=""){
        //如果是自动截图 则进行截图及上传操作
        if(document.getElementById("capture").value=="自动截图"){
        chrome.tabs.captureVisibleTab(function(screenshotUrl) {
            //构建上传的formdata
            $("#registerForm").attr("enctype","multipart/form-data");
    	    //正则匹配替换掉前面的字符
    	    var Pic = screenshotUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    	  //构建上传的formdata
            var formData = new FormData($("#registerForm")[0]);
            formData.append("imgBase64",encodeURIComponent(Pic));//
            formData.append("fileFileName","photo.jpg");
            formData.append("login",localStorage.getItem("redmineusername"));
            formData.append("password",localStorage.getItem("redminepassword"));
            //上传 自动截图
            $.ajax({  
                url: "http://127.0.0.1:5000/upload",
                type: 'POST',  
                data: formData,  
                timeout : 10000, //超时时间设置，单位毫秒
                cache: false,  
                contentType: false,  
                processData: false, 
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
                        success: function (data, textStatus, xhr) {
                            //问题提交成功后相关信息的销毁和重置
                            document.getElementById("attachlist").value="";
                            localStorage.removeItem("lastuser");
                            localStorage.setItem("lastuser",document.getElementById("questionfor").value);
                            localStorage.removeItem("lastproject");
                            localStorage.setItem("lastproject",document.getElementById("project").value);
                            if(data.result=="success"){
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
        }else if(document.getElementById("capture").value=="截图并编辑"){
            var iHeight = "500";
            var iWidth="700";
            var iTop = (window.screen.availHeight - 30 - iHeight) / 2;    //获得窗口的垂直位置;  
            var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;      //获得窗口的水平位置;  
            chrome.tabs.captureVisibleTab(function(screenshotUrl) {
            	console.dir(screenshotUrl);
            	curPopupWindow = window.open("background.html?login="+login+"&password="+password+"&projectid="+projectid+"&projectname="+projectname+"&track="+track+
            			 "&subject="+subject+"&description="+description+"&priority="+priority+"&severity="+severity+"&reappear="+reappear+
            			 "&type="+type+"&environment="+environment+"&assigneeid="+assigneeid+"&assigneename="+assigneename+
            			 "&img="+screenshotUrl, "BUG提交插件-截图编辑", 'height=' + iHeight + ',width=' + iWidth + ',top=' + iTop + ',left=' + iLeft +',edge=raised, center=yes, help=no,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no,status=no')
        		});
    	} else{
            //上传附件或者无附件方式的问题提交
            $.ajax({
                url:"http://127.0.0.1:5000/createIssue",
                type:"POST",
                timeout:20000,
                //async: false,
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
                },
                beforeSend:function(){
                    $('#fakeloader5').css('display','block')
                },
                success: function (data, textStatus, xhr) {
                    //问题提交成功后信息的销毁和重置
                    $('#fakeloader5').css('display','none')
                    document.getElementById("attachlist").value="";
                    localStorage.removeItem("lastuser");
                    localStorage.setItem("lastuser",document.getElementById("questionfor").value);
                    localStorage.removeItem("lastproject");
                    localStorage.setItem("lastproject",document.getElementById("project").value);
                    console.dir(data)
                    console.log(data.status)
                    if(data.result=="success"){
                        $.jGrowl("提交成功", { header: 'Operating Result' });	
                    }else{
                        $.jGrowl("提交失败", { header: 'Operating Result' });
                    }
                    
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    $('.fakeloader').css('display','none')
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
