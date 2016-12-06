// !!!!!!!!!!!!!
// NO DOM ACCESS
// !!!!!!!!!!!!!


// if ( !/(^file|^https?:\/\/(www\.)?dropbox\.com\/home\/)/.test(tabs[0].url) ) {
//
//   console.log("yes");
//
//   chrome.browserAction.setIcon({
//     path : {
//       "16": "gray16.png",
//       "32": "gray32.png"
//     }
//   });
//
// } else {
//   console.log("no");
// }



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

  	console.log(request.greeting);

    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.greeting == "hello") {
      sendResponse({farewell: "goodbye"});
    }

    sharePath = request.greeting;
    console.log(sharePath);

});


////
//// ICON CLICK ACTION
//// Do this when icon is clicked.
////
chrome.browserAction.onClicked.addListener(function(tab) {

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {


		var currUrl = tabs[0].url

		if ( /^https?:\/\/(www\.)?dropbox\.com\/home\//.test(currUrl) ) { // If the current URL is on Dropbox, and is not a shortened link.
			var newUrl = currUrl.replace(/https?:\/\/(www\.)?dropbox\.com\/home\//gi, "file:///Users/jameskupczak/Dropbox%20(MedBridge%20.)/");
			var newUrl = newUrl.replace(/\/?\?preview=/gi, "\/");
		}

		else if ( /^https?:\/\/(www\.)?dropbox\.com\/s\//.test(currUrl) ) { // Else, if the URL is shortened.

			var filename = currUrl.replace(/(https?:\/\/(www\.)?dropbox\.com\/s\/.+?\/|\?dl=.+)/gi, "");

			var newUrl = "file:///Users/jameskupczak/Dropbox%20(MedBridge%20.)" + sharePath + filename

		} else if ( /^https?:\/\/(dl\.)?dropboxusercontent\.com\/s\//.test(currUrl) ) { // Else, if the URL is dl.dropboxusercontent.com

			var newUrl = currUrl.replace(/(https?:\/\/(dl\.)?dropboxusercontent\.com\/s\/.+?\/|\?dl.+)/gi, "");

			var splitUrl = newUrl.split("-",6);

			var discipline = splitUrl[3];
			var year       = splitUrl[0];
			var fullYear   = "20" + year;
			var month      = splitUrl[1];
			var fullMonth  = "";
			var day        = splitUrl[2];
			var author     = splitUrl[5];
			var filename   = newUrl;

			if ( month === "01" ) { fullMonth = "Jan" }
				else if ( month === "02" ) { fullMonth = "Feb" }
				else if ( month === "03" ) { fullMonth = "Mar" }
				else if ( month === "04" ) { fullMonth = "Apr" }
				else if ( month === "05" ) { fullMonth = "May" }
				else if ( month === "06" ) { fullMonth = "June" }
				else if ( month === "07" ) { fullMonth = "July" }
				else if ( month === "08" ) { fullMonth = "Aug" }
				else if ( month === "09" ) { fullMonth = "Sept" }
				else if ( month === "10" ) { fullMonth = "Sept" }
				else if ( month === "11" ) { fullMonth = "Nov" }
				else if ( month === "12" ) { fullMonth = "Dec" }

			var newUrl = "file:///Users/jameskupczak/Dropbox%20(MedBridge%20.)/Marketing%202/Campaigns/Email/" + discipline + "/" + fullYear + "/" + fullMonth + "-" + discipline + "/" + year + "-" + month + "-" + day + "-" + author + "/" + filename

		}

		else if ( /^file/.test(currUrl) ) { // Else, it's a local file.
			var newUrl = currUrl.replace(/file:\/\/\/Users\/(jameskupczak)?\/Dropbox%20\(MedBridge%20\.\)\//gi, "https://www.dropbox.com/home/");
		}

		chrome.tabs.update({
		     url: newUrl
		});

	});

});
