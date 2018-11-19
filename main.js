var grabCodeTimer = -1;
var grabCodeUrl = "http://tifu-apps-ws.xoyo.com/jx3/tifu/grabcode?callback=jQuery";
var questionUrlUrl = "http://tifu-apps-ws.xoyo.com/jx3/tifu/question?callback=jQuery";
var startTime = 0;
var g_randNum = "17208184988862922153";
var autoActiveTimer = -1;
var grabCodeTimerEx = -1;
var g_stopFlag = false;

//////
var randArr = ['0','1','2','3','4','5','6','7','8','9',
				'Q','W','E','R','T','Y','U','I','O','P',
				'A','S','D','F','G','H','J','K','L','Z',
				'X','C','V','B','N','M'];

//将日期转化字符串(yyyy-MM-dd)
function DateToStr(date){
	var year = date.getFullYear();
	var month =(date.getMonth() + 1).toString();
	var day = (date.getDate()).toString();
	if (month.length == 1) {
		month = "0" + month;
	}
	if (day.length == 1) {
		day = "0" + day;
	}
	var hour = date.getHours().toString();
	var min = date.getMinutes().toString();
	var sec = date.getSeconds().toString();
	if (hour.length == 1) {
		hour = "0" + hour;
	}
	if (min.length == 1) {
		min = "0" + min;
	}
	if (sec.length == 1) {
		sec = "0" + sec;
	}
	dateTime = year +"-"+ month +"-"+  day + " " + hour + ":"+ min + ":"+ sec;
	return dateTime;
}

function generatorArr(){
	var res = [];
	var i=0;
	for (let index = 0; index < randArr.length; index++) {
		const element1 = randArr[index];
		for (let index = 0; index < randArr.length; index++) {
			const element2 = randArr[index];
			for (let index = 0; index < randArr.length; index++) {
				const element3 = randArr[index];
				res[i] = element1+element2+element3;
				i++;
			}
		}
	}
	return res;
}

function getCallbackEx(response){
	if (response.readyState == 4) {
		 if (response.status == 0) {
		 	return;
		 }
		 var responseText = response.responseText.split("(")[1].split(")")[0];
		 try{
			var responseObj = JSON.parse(responseText);
			if(responseObj.status == -20101){
				window.clearInterval(autoActiveTimer);
				startTime = 0;
			}
			// var tips = $("#Tips").html();
			// tips += (DateToStr(new Date()) +" "+ responseObj.message +"<br />");
			// $("#Tips").html(tips);
			//console.log(DateToStr(new Date()) +" "+ responseObj.message);
			$("#Tips").append(DateToStr(new Date()) +" "+ responseObj.message +"<br />");
			 
		 }catch(e){
			//TODO handle the exception
			// var tips = $("#Tips").html();
			// tips += (DateToStr(new Date()) +" "+ "激活解析返回消息错误" +"<br />");
			// $("#Tips").html(tips);
			//console.log(DateToStr(new Date()) +" "+ "激活解析返回消息错误");
			$("#Tips").append(DateToStr(new Date()) +" "+ "激活解析返回消息错误" +"<br />");
		 }
		 
	}
}

function activeCode(code) {
	// var tips = $("#Tips").html();
	// tips += (DateToStr(new Date()) +" "+ "activeCode: " + code +"<br />");
	// $("#Tips").html(tips);
	//console.log(DateToStr(new Date()) +" "+ "activeCode: " + code);
	$("#Tips").append(DateToStr(new Date()) +" "+ "activeCode: " + code +"<br />");
	if(startTime == 0 ){
		startTime = (new Date()).getTime();
	}
	var url = "http://tifu-apps-ws.xoyo.com/jx3/tifu/activate?callback=jQuery"+
		g_randNum+"_"+startTime+"&code=" + code + "&_="+ (new Date()).getTime();

	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true); //Open the XHR request. Will be sent later
	xhr.onreadystatechange = function (event) {
		getCallbackEx(event.target);
		//pm.request.response.load(event.target);
	};
	xhr.responseType = "text";
	xhr.send();
		
	// $.get(url, function(data, status) {
	// 	$("#Tips").append(DateToStr(new Date()) +" "+ "Data: " + data + " Status: " + status +"<br />");
	// 	//console("Data: " + data + "\nStatus: " + status);
	// });
	startTime++;
}

function grab(grabUrl, answer){
	if(startTime == 0 ){
		startTime = (new Date()).getTime();
	}
	var strUrl = grabUrl + startTime + "&answer="+ answer +"&_=" + (new Date()).getTime();
	startTime++;
	urlByGet(strUrl);
}

function getCallback(response){
	if (response.readyState == 4) {
		if (response.status == 0) {
			return;
			}
		var responseText = response.responseText.split("(")[1].split(")")[0];
		try{
			var responseObj = JSON.parse(responseText);
		 	//var preStatus = $("#grabCodeText").attr("status")*1;
			//if(preStatus != responseObj.status){
				if(responseObj.status == 1){
					var question = responseObj.data.question;
					$("#Tips").append(DateToStr(new Date()) +" "+ question +"<br />");
					//grabCodeText.innerHTML =  question;
					//$("#grabCodeText").attr("status", responseObj.status);
					var answer = question.split("）")[0].split("答案填")[1];

					if(grabCodeTimer != -1) {
						window.clearInterval(grabCodeTimer);
					}
				
					var grabUrl = grabCodeUrl + g_randNum + "_";
					grabCodeTimer = window.setInterval(function() {
						grab(grabUrl, answer);
					},10);
				}else if(responseObj.status == -20404){
					if(grabCodeTimer != -1) {
						//window.clearInterval(grabCodeTimer);
					}
					$("#Tips").append(DateToStr(new Date()) +" "+ responseObj.message +"<br />");
					//grabCodeText.innerHTML = responseObj.message;
					//$("#grabCodeText").attr("status", responseObj.status);
				}else if( responseObj.status == -20202){//活动未开始
					$("#Tips").append(DateToStr(new Date()) +" "+ responseObj.message +"<br />");
					if (!g_stopFlag) {
						$("#send3Min").click();
					}
				}else{
					$("#Tips").append(DateToStr(new Date()) +" "+ responseObj.message +"<br />");
				}
				
			//}
			 
		 }catch(e){
			//TODO handle the exception
			$("#Tips").append(DateToStr(new Date()) +" "+ "解析返回消息错误" +"<br />");
		 	//grabCodeText.innerHTML = "解析返回消息错误";
		 }
		 
	}
}

function urlByGet(url){
	var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); //Open the XHR request. Will be sent later
    xhr.onreadystatechange = function (event) {
    	getCallback(event.target);
        //pm.request.response.load(event.target);
    };
    xhr.responseType = "text";
    xhr.send();
    
    
}

function generateMixed(n) {
    var res = "";
    for(var i = 0; i < n; i++) {
    	var id = Math.floor(Math.random() * 36);
    	res += randArr[id];
    }
    return res;
}

$(function() {
	var randNum = $("#JQueryNum").val();
	if(randNum != ""){
		g_randNum = randNum;
	}


	$("#stopSend3Min").click(function() {
		window.clearInterval(grabCodeTimer);
		startTime = 0;
		g_stopFlag = true;
		//$("#grabCodeText").attr("status", "-1");
	})

	$("#send3Min").click(function() {
		
		
		//var grabUrl = grabCodeUrl + randNum + "_";
		var questionUrl = questionUrlUrl + g_randNum + "_";
		//grabCodeTimer = window.setInterval(function(url) {
			if(startTime == 0 ){
				startTime = (new Date()).getTime();
			}
			//var strUrl = grabUrl + startTime + "&_=" + (new Date()).getTime();
			var strUrlEx = questionUrl + startTime + "&_=" + (new Date()).getTime();
			startTime++;
			//urlByGet(strUrl);
			urlByGet(strUrlEx);
		//},10);
	});

	$("#clearLog").click(function(){
		Tips.innerHTML = "";
	});

	$("#activeCode").click(function() {
		var codeVal = $("#Code").val();
		var codeArr = codeVal.split(" ");
		for (var  i = 0; i < codeArr.length; i++) {
			var  code = codeArr[i];
			if(code.indexOf("?") != -1){
				for (var  index = 0; index < randArr.length; index++) {
					activeCode(code.split("?")[0]+randArr[index]+code.split("?")[1]);
				}
			}else if(code.indexOf("？") != -1){
				for (var  index = 0; index < randArr.length; index++) {
					activeCode(code.split("？")[0]+randArr[index]+code.split("？")[1]);
				}
				
			}else{
				activeCode(code);
			}
		}
		
	});

	$("#activeCodeEx").click(function() {
		var codeVal = $("#Code").val();
		var codeArr = codeVal.split(" ");

		var arr = generatorArr();
			for (let index = 0; index < arr.length; index++) {
				const element = arr[index];
				autoActiveTimer = window.setInterval(function() {
			
					var codeText = '';
					for (let index1 = 0; index1 < codeVal.split("?").length-1; index1++) {
						codeText += codeVal.split("?")[index1] + element[index1];
						
					}
					codeText += codeVal.split("?")[codeVal.split("?").length-1];
					activeCode(codeText);
				},10);
			}

		
		
	});

	

	$("#autoActiveCode").click(function() {
		autoActiveTimer = window.setInterval(function() {
			activeCode('PL' + generateMixed(14));
		},10);
		
		
	});

	$("#stopAutoActiveCode").click(function(){
		window.clearInterval(autoActiveTimer);
		startTime = 0;
	});

	$("#autoGrab").click(function() {
		var answer = $("#answer").val();
		if(answer == ""){
			answer = "是";
		}

		if(grabCodeTimerEx != -1) {
			window.clearInterval(grabCodeTimerEx);
		}
	
		var grabUrl = grabCodeUrl + g_randNum + "_";
		grabCodeTimerEx = window.setInterval(function() {
			grab(grabUrl, answer);
		},10);
		
	});

	$("#stopAutoGrab").click(function(){
		window.clearInterval(grabCodeTimerEx);
		startTime = 0;
	});
	
	
})