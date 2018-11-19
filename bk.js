// Create context menu items

var codeArr = [];
var activeIndex = 0;

function clearCodeArr(){
	codeArr = [];
	activeIndex = 0;
}

function setCodeArr(data){
	if(typeof data == "string"){
		codeArr[codeArr.length] = data;
		//codeArr.push(data);
	}else if(typeof data == "object"){
		Array.prototype.push.apply(codeArr, data);
	}
	
//	var i = codeArr.length;
//	var j =0
//	for (;j<data.length;i++,j++) {
//		codeArr[i] = data[j];
//	}
}

function getCodeToActive(){
	if(activeIndex >= codeArr.length){
		return "err";
	}
	activeIndex++;
	return codeArr[activeIndex-1];
}

function getActivedNum(){
	return activeIndex;
}

function resetActiveIndex(){
	activeIndex = 0;
}

function getCodeArr(){
	return codeArr;
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
  });
});



