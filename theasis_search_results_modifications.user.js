// ==UserScript==
// @name           iStock search/lightbox result modifications
// @namespace      theasis
// @version        1.0.15
// iStockPhoto browser script (c) Martin McCarthy 2013,2014
// ==/UserScript==
// v0.0.1 Martin McCarthy 4 May 2013
// Highlight my images
// v0.1.0 Martin McCarthy 28 May 2013
// Calculate royalties
// First public release
// v0.1.1 Martin McCarthy 30 May 2013
// If all the search results are mine, highlight the count text rather than the search results
// v0.1.2&0.1.3 Martin McCarthy 27 June 2013
// iStock changed the search results page
// style fixee
// v0.1.4 Martin McCarthy 3 July 2013
// Handle in-page search result modifications better
// v0.1.6 Alezz 10 July 2013
// merge sjlocke code for monthly graph
// v0.1.7 Martin McCarthy 1 August 2013
// replace SJL's graph code
// v0.1.8 Martin McCarthy 2 August 2013
// avoid the f5_legacy styles
// v0.2.0 Martin McCarthy 3 August 2013
// Loupe done right:
// - don't wait for data to load before showing the image;
// - don't cover the image you're over
// - don't make it hard to move to the next image
// - don't disappear off the bottom of the screen(!)
// Disable the Royalty button if none of the displayed files are yours
// v0.2.0 Martin McCarthy 9 August 2013
// dynamic video/audio preview
// v0.2.1 Martin McCarthy 10 August 2013
// FF23 nonsense
// v0.2.2 Martin McCarthy 12 August 2013
// settings on the istock prefs page
// option to leave the royalty button enabled
// v1.0.0 Martin McCarthy 16 August 2013
// zoom the loupe
// v1.0.1 Martin McCarthy 30 August 2013
// work under the /royalty-free path
// v1.0.2 Martin McCarthy 2 October 2013
// fix loading of loupe details
// v1.0.3 Martin McCarthy 3 October 2013
// new option on the preferences page to use the old loupe
// icons to add a file to a lightbox and (if we're in a lightbox view) remove the file from the lightbox
// v1.0.5 Martin McCarthy 5 October 2013
// easy comparison by displaying several loupe-sized images - click the flags
// v1.0.6 Martin McCarthy 27 October 2013
// fixes for iStock's changes to the results page
// - hide the istock loupe & show mine
// - re-enable the large thumb comparison + flags
// - re-enable the LB add/remove buttons
// add a small button to the top-right of each big thumb to easily dismiss it
// v1.0.7 Martin McCarthy 2 November 2013
// fix the loupe image size when using big thumbs
// raise the z-index of flags and LB controls
// add a collection indicator when that information is available (often it isn't!)
// v1.0.8 Martin McCarthy 3 December 2013
// site changes made the collection indicator go away. This should bring it back.
// v1.0.9 Martin McCarthy 12 December 2013
// site changes broke the loupe, zoom and large thumb comparator. This should fix them.
// v1.0.10 Martin McCarthy 21 December 2013
// add a zoom icon to the thumbnail mouse-over icons
// scale the zoom better for large thumbs
// make the zoom offset aware of thumb size
// add shortcut buttons to the Edit and Downloads pages for your files
// v1.0.11 Martin McCarthy 13 August 2014
// cope with recent URL changes
// v1.0.12 Martin McCarthy 21 September 2014
// Main collection becomes Essentials collection
// Include Subs when calculating totals and drawing graphs on the result page
// v1.0.13 Martin McCarthy 30 October 2014
// An image's contributor is now linked through name rather than id
// iStock no longer embeds "#File number" in an anchor tag
// Per file royalties are now highlighted in red when non-zero
// v1.0.14 Martin McCarthy 4 November 2014
// iStock changed the case of usernames is some circumstances
// v1.0.15 Martin McCarthy 8 January 2015
// graph royalties for more than this year

function main() {
	// this part is...
	// @copyright      2009, 2010 James Campos
	// @license        cc-by-3.0; http://creativecommons.org/licenses/by/3.0/
	if (typeof GM_deleteValue == 'undefined') {

		GM_addStyle = function (css) {
			var style = document.createElement('style');
			style.textContent = css;
			document.getElementsByTagName('head')[0].appendChild(style);
		}

		GM_deleteValue = function (name) {
			localStorage.removeItem(name);
		}

		GM_getValue = function (name, defaultValue) {
			var value = localStorage.getItem(name);
			if (!value)
				return defaultValue;
			var type = value[0];
			value = value.substring(1);
			switch (type) {
			case 'b':
				return value == 'true';
			case 'n':
				return Number(value);
			default:
				return value;
			}
		}

		GM_log = function (message) {
			console.log(message);
		}

		GM_openInTab = function (url) {
			return window.open(url, "_blank");
		}

		GM_registerMenuCommand = function (name, funk) {
			//todo
		}

		GM_setValue = function (name, value) {
			value = (typeof value)[0] + value;
			localStorage.setItem(name, value);
		}
	}
	// end of James Campos' code

var zoomicon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAuCAMAAACS246gAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNjBFRUVCOTY5ODYxMUUzQjg4N0NDQTVGMUM0Q0QwRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNjBFRUVCQTY5ODYxMUUzQjg4N0NDQTVGMUM0Q0QwRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA2MEVFRUI3Njk4NjExRTNCODg3Q0NBNUYxQzRDRDBFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA2MEVFRUI4Njk4NjExRTNCODg3Q0NBNUYxQzRDRDBFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+WrY5EQAAAwBQTFRFerzHa73MlcLJJoKSttrgjczYhsLMQ6y/jr3FNpqqz+frMaS5lMbP9fr8brbC4vDzhcnWDnWGK6G3Ip20JpGjZrG+ks7aisTN4vL1ZbvKV7TGxeXrqdnhTqa0ndPdlcnSEYaadcLQcsDPWrbHaLK/W6y5R63AS6SzRqGxo9DYUrLEDoWZHpuyG4yh////DXiLDX6RHpqxDoSYDoOXHJKo/f7+8fn6+/39HpmwHpmvDXiKgba/iMDK8fj5I5Ci+vz98Pf5HJOpj8PN/P7+iLrC9fr7MpOl/P3+8/r7+v39kMTN+fz9ibrD9vv8DoGVDoKWRJOgn8zUT6KxmcTLDXyO8vn7l8jQDXmLHZivDXqMkL/He7K7G42iHZSqDX+SHZetHJClgrzHnMXMm8rS8vn6IIqeos3VE3iI8vj5HIicMJGk9Pr79/v8G46j6fP16PLzaaizI4CQcrTA8/n6hLjAi8HL5fL0HH2Ng73IfrS9h7/Je7O8hr7J5/T3M5OlL4eXLpCj/v//DX2Qg7fA+fz8qdHYKY+i8Pj5lsfQf7W+kL7GO5ippMrQisHLIX+QqdPbZ7zLPam9HIyf+Pz8r9vkXK26+Pv89Pn68vj6L5an0uns1ezx6vT29vr7HI6jyufthb7JwN/kkM7Z9vv7lsrSY7rKTKWzbLG9iMPNicDLptLZ0uvvs9jfuN/nWLXGWKq4fLO89Pr6Opusx+LnhL3I5PH05PP2q9riV6q48Pj6gre/fbS9Y6Sv7/f46fL0+/3+5vT2G4ebYrnJccDOfMXSH4qdiL/K4O/ynMrTSKKxz+rvgcfUcL/OD4WZEneI9/v7p9jhYK+8v+Pp5vL0ncbNksjRSq/Bo87V9/z9KZOlfr3Iu93ivN3jH5uycrjDm9PdXbfHG4yfUae19fr6+Pz9PZ2tMKO4NaW6VLPEOKa70ervVqm3wOPquuDnIY+hkcfQgLW+oc/XzOXpYrC96/b4vOHov9/kOZur6PX3FIibmNHcmdLcX667bLTBYbnJ////NsITMAAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAW7SURBVHjatJh3dNNWFMZNTKHgUkjTQikFCgQKSHpyYlmO4xk7dpxhMp1JQoZD9oYwEwgrYUMTZhIoYe9SChTKLN2T7r33nrSlLTVPTmLpyZbSnJ5+f+g9HR//fP3pvvfulcTFk6FiRcyMeRkZ82bErKgwuHqQqrwpaubsnJzZM6OaylX8TyXIXURiTGWVfyhJpqSQZKh/VWVMolKYbI6Pqi4uIghi6lR4KSqujopXCsIj/OZIQ9PkWYpgtxRZ8rRQ6XK/CAF03nwrUUZlhgS5FZJJlRHWuU+ZfcNzNQtIuSIY4yhYIScXaF71xZ6uXUlQ6iCcoyA1RazUvuELnh5HLorFvBS7iIxL92YnJxBUKu6lVIpISPaCq8KlSVMwn5qSJA3nPSuVqT57Gu5T07LrTSoUvkpTII/FBBQrLzizisteqs33FXZ38Pn7l3LhL2qg25igoPOaJSx7o5YIC8EFFRJGaA0sPGJxgRwTlbxgsSfLzKvzw3BRheWvVnrgN0vF4u6MXbqiG35LPRUiDg+h6pu64blxSbFYD4pNisvtysGE7FS8B6VmJ0zvhCs1JJonW/aM/N07Z0iN+68qtQSaJ+uPjJvgnTOEVumG+81CDH9/YI3RWHii3/d822f5MfC8ZYjhjx0soWnHxZs+59u+LI+BK+eQHMP1O9pBY/vORlXD4C0828nlMBjlfELNImQjSgFtL6UvNJxcj8LVxFwlhCdKOYHr24Gh38jb9RPfPgdqeHS5NNHlirdSHLYdRHaM+0I2echpUMKjU9Z4CA8PZQPX14Lj+q7pLrBEj4YeGu5ymTiBy+rAdlnXdBSIlvFCN7kkhso0dq/aBZ5kgId+Y+hrwUAEHpxWaVBVl7F71ShwJwM8PIKht4CvEXhQWbVKUlHFuvKapfFjONwXbbyXoW/UfYP6UlVRXsy68ped/hAOt0XSdzH0aPof1Jfickm6f5bn25ZjJzAWjq0tnYTAs/zTk4syPd+2D7qIs3C8pfluBJ5ZlCyJYS0fsHnnT/DaLzDaGCjZgGGBNYN5psdEEZ7F2d9WegVeO8ZG0mOHrMPxyyUn0WVKREk0pMfyp42WW7EBhWCTwbzJoNuAbdBtQk0nNVrCY/mXtH0M/AVgiTSXRDrX4eucFtR0Qit5gIV/prOMxrB3tx5w6iYNPI5hvxS28eCPPMTCX3faR+H4t62nbM4rB7fjeB/brzz4/ZKMFA/8eWDZyowfdXk+urQvDz4vZ6oH/h6wt3I9/+DNqzz4bC4cO9S4eUDnA90Dh2uWmjtE4Phh2ta/E34EDgH2kue84BxbMOwd0JfJ8621zI2k+RwmYguOvwy+Y/K8tY65eTb6NO5li4YL1zeDfd3LMtBonIiJPFAmtUFH97K8TNOTca8HyklFqAd14Oe/74GTkQdqgHE8xl//nFSEmuAAz/QJgJNxp0oAPZx3YhAmZBEx9AhQ2FA7ONIISnVAN0xsETF0M7A11J28QINPncAx1GsRnV+DHp/6H5S6Y59stqzVH9WBwn3I8l9zvm0hhRBkfyodg+w2e4tstxPYOpDlv7AN3bjcujb++vWX3oKTo2jsXhuXWwHDx4zp8xWc7HYgsbs3LmTL5elhGPsw4S2Xp0cdwDYU3XJdiWuEywpIt/RlXWEOC54vCJ0G9qusK8xhoVxOCtcV43WgFj3m5gqHjg93gDr0mOMf0Kh2vKIXPaBRjfhDhh7Q3qWF73JUqLTwXY52lxZMUaToia3gFkXqnthqT1HU63LO2nM5Z23qTSH6wozeFKKPz2QLUdfGXpXQS3pVQsPi/0yBMF0BC2i0+N+fTwn6rqbyVy/9b22LVbhtsfLblv+34WIy8keBVjHXZ6v4hECrOL0XTe4c0SZ3G7fJ3UZY5+eZRdrz8LNMe54CxbTnZ8PF23PT3uJLTHfO9OeXiveaRNpz9sVCBtS/f7GQA+XzxcINAQYAGPIY4jaBmyYAAAAASUVORK5CYII=";

var theasisStatsYear='YEAR';
var theasisStatsOffset=0;

// iStock preferences page script
//
// assumes jQuery loaded as window.jQ
//
theasisPrefs={
	setup:function(heading){
		var container=jQ("#theasis_settings");
		if (container.length<1) {
			container=jQ("<div id='theasis_settings'><h1>Theasis Script Settings</h1></div>");
			jQ("#tabMainContainer_settings").append(container);
		}
		theasisPrefs.addHeading(heading);
	},
	addHeading:function(text){
		jQ("#theasis_settings").append(jQ("<h2 class='h2withline'>"+text+"</h2>"));
	},
	addCheckbox:function(key,text,defaultVal){
		var checkbox=jQ("<input type='checkbox' name='"+key+"' id='"+key+"' class='theasis_userPref'>").prop('checked',GM_getValue(key,defaultVal));
		checkbox.click(function(){
			GM_setValue(key,jQ(this).prop('checked'));
		});
		jQ("#theasis_settings").append(jQ("<div/>").append(checkbox).append(jQ("<label for='"+key+"' class='optional'>"+text+"</label>")));
	},
	cleanup:function(){
		jQ("#theasis_settings").remove();
	}
};

	var patterns = {
		royalty: {
			regular: '(\\w+):\\s+\\$(\\d+\\.\\d+)\\s+File\\s+purchase\\s+royalties',
			sub: '(\\w+):\\s+\\$(\\d+\\.\\d+)\\s+Subscription\\s+royalties',
			el: '(\\w+):\\s+\\$(\\d+\\.\\d+)\\s+Extended\\s+License\\s+royalties',
			gi: '(\\w+):\\s+\\$(\\d+\\.\\d+)\\s+G\\.I\\.\\s+Sales\\s+royalties',
			pp: '(\\w+):\\s+\\$(\\d+\\.\\d+)\\s+Partner\\s+Program\\s+royalties'
		},
		dl: {
			regular: '(\\w+):\\s*(\\d+)\\s*File\\s+purchase\\s+down',
			sub: '(\\w+):\\s*(\\d+)\\s*Subscription\\s+down',
			el: '(\\w+):\\s*(\\d+)\\s*Extended\\s+License\\s+down',
			gi: '(\\w+):\\s*(\\d+)\\s*G\\.I\\.\\s+Sales\\s+down',
			pp: '(\\w+):\\s*(\\d+)\\s*Partner\\s+Program\\s+down'
		},
		style: {
			regular: 'bargraph_F',
			sub: 'bargraph_SUB',
			el: 'bargraph_EL',
			gi: 'bargraph_GI',
			pp: 'bargraph_PP'
		}
	};
	var barKeys = ['regular', 'sub', 'el', 'gi', 'pp'];
	// Monthly data variables

	var monthlyRoyalties = [];
	var monthlyDownloads = [];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Year'];
	var mnLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'YEAR'];
	var mnRev = {
		January: 0,
		February: 1,
		March: 2,
		April: 3,
		May: 4,
		June: 5,
		July: 6,
		August: 7,
		September: 8,
		October: 9,
		November: 10,
		December: 11
	};
	resetMonthlyData();
	// End of monthly data variables

	function resetMonthlyData() {
		for (var i = 0; i < months.length; i++) {
			monthlyRoyalties[i] = 0;
			monthlyDownloads[i] = 0;
		}
	}
	
	// Returns an array of div tags ready for outputing
	// Added for monthly graph output
	function chart(values) {
		var last = values.length - 1;
		var sum = 0;
		var maximum = 0;
		var chartSize = 100;
		var output = new Array();
		values[last] = {
			total: 0,
			regular: 0,
			sub: 0,
			gi: 0,
			pp: 0,
			el: 0
		};
		for (var i = 0; i < values.length; i++) {
			if (i != last && values[i].total) {
				values[last].total += values[i].total;
				values[last].regular += values[i].regular;
				values[last].sub += values[i].sub;
				values[last].gi += values[i].gi;
				values[last].pp += values[i].pp;
				values[last].el += values[i].el;
//				console.log("last.total " + values[last].total);
				if (parseFloat(values[i].total) > maximum) {
					maximum = parseFloat(values[i].total);
				}
			}
		}

		for (var i = 0; i < last; i++) {
			output[i] = {
				total: Math.max(Math.round(chartSize * parseFloat(values[i].total) / maximum), 1),
				regular: Math.max(Math.round(chartSize * parseFloat(values[i].regular) / maximum), 1),
				sub: Math.max(Math.round(chartSize * parseFloat(values[i].sub) / maximum), 1),
				gi: Math.max(Math.round(chartSize * parseFloat(values[i].gi) / maximum), 1),
				pp: Math.max(Math.round(chartSize * parseFloat(values[i].pp) / maximum), 1),
				el: Math.max(Math.round(chartSize * parseFloat(values[i].el) / maximum), 1)
			};
		}
		output[last] = {
			total: chartSize,
			regular: Math.max(Math.round(chartSize * parseFloat(values[i].regular) / values[last].total), 1),
			sub: Math.max(Math.round(chartSize * parseFloat(values[i].sub) / values[last].total), 1),
			gi: Math.max(Math.round(chartSize * parseFloat(values[i].gi) / values[last].total), 1),
			pp: Math.max(Math.round(chartSize * parseFloat(values[i].pp) / values[last].total), 1),
			el: Math.max(Math.round(chartSize * parseFloat(values[i].el) / values[last].total), 1)
		};

		return output;
	}

	loggedInUser = function () {
		var id = null;
		var name = null;
		jQ('script').each(function () {
			var match = jQ(this).text().match(/var\s+lpVisitorID\s*=\s*'(\d+)'/);
			if (match) {
				id = match[1];
				var match = jQ(this).text().match(/var\s+lpMemberName\s*=\s*'([^']+)'/);
				if (match) {
					name = match[1];
				}
			}
		});

		return [id,name];
	};
	addClickHandlers = function () {
		document.addEventListener("animationstart", searchResultsChanged, false);
		document.addEventListener("webkitAnimationStart", searchResultsChanged, false);
	};
	doStyle = function () {
		var el = jQ("#theasis_search_results_mods_style");
		if (el.length<1) {
			hideOriginalLoupe = GM_getValue("theasis_searchResults_useOriginalLoupe",false) ? "" : ".tooltipster-base { position: fixed; left: 10000px !important; top: 10000px !important; } .loupe { display: none; visibility: hidden; left: 10000px !important; top: 10000px !important; }";
			jQ("<style type='text/css' id='theasis_search_results_mods_style'>@keyframes theasis_search_results_mods_search_results_updated{ from{clip:rect(1px,auto,auto,auto);} to{clip:rect(0px,auto,auto,auto);}} @-moz-keyframes theasis_search_results_mods_search_results_updated{ from{clip:rect(1px,auto,auto,auto);} to{clip:rect(0px,auto,auto,auto);}} @-webkit-keyframes theasis_search_results_mods_search_results_updated{ from{clip:rect(1px,auto,auto,auto);} to{clip:rect(0px,auto,auto,auto);}} #results-container .lastRow { animation-duration: 0.001s; -moz-animation-duration: 0.001s; -webkit-animation-duration: 0.001s; animation-name: theasis_search_results_mods_search_results_updated; -moz-animation-name: theasis_search_results_mods_search_results_updated; -webkit-animation-name: theasis_search_results_mods_search_results_updated; } .bargraph_main {position: relative; overflow: hidden; background-color: #ddb; border: 1px solid #996; width: 50px;} div.theasis_roybar {display: inline-block; margin: 0; position: absolute; bottom: 0; } div.theasis_dlbar {display: inline-block; margin: 0; position: absolute; top: 0; } div.theasis_graphcontainer {float:left; height: 300px; width: 50px; margin: 0 2px; text-align:center;} div.theasis_graphcell {display: table-cell; vertical-align: bottom; height: 150px; width: 50px;} #searchReturnDataMonthly_div {display: block; height: 300px;} .bargraph_F { background-color:#5a86b3; } .bargraph_SUB { background-color:#c06060; } .bargraph_EL { background-color:#ff991c; } .bargraph_GI { background-color:#90c; } .bargraph_PP { background-color:#777700; } .icons.scWhiteFlag{width:12px; height:12px; background-position:-252px -24px; position: absolute; left: 2px; top: 40px; pointer:pointer; z-index:4999;} .icons.scFlag{width:12px; height:12px; background-position:-276px -24px; position: absolute; left: 2px; top: 40px; pointer:pointer; z-index:4999;} #theasisCompareContainer{background-color:#fff; border: 3px solid #ccc; margin-bottom: 20px; padding-left:1px;} #theasisCompareContainer img{border:1px solid #ccc;} .theasisCompareThumbContainer{margin-bottom:1ex; position:relative;} .theasisCompareThumb{z-index:10;} .theasisCompareThumbDismiss{position:absolute; top:10px; right:10px; z-index:100; width:11px; height:12px; cursor:pointer;} .theasisAddToLightboxIcon{width:21px; height:21px; position: absolute; left: 2px; top: 60px; pointer:pointer; z-index:100;} .theasisRemoveFromLightboxIcon{width:21px; height:21px; position: absolute; left: 2px; top: 83px; pointer:pointer; z-index:100;} .theasisCollectionIndicator{font-size:85%; font-weight:bold; z-index:200; color:#333; padding:0px 3px; border:1px solid #333; position:absolute; top:8px; right:5px; border-radius:0.5em;} .theasisCollectionIndicatorMain{background-color:#ddd;} .theasisCollectionIndicatorSig{background-color:#dff;} .theasisCollectionIndicatorPlus{background-color:#ffd;} .theasisCollectionIndicatorVetta{background-color:#fdb;} .theasis-search-zoom { background:url('"+zoomicon+"') no-repeat; height:46px;width:46px; background-position: 0 0; } .theasis-search-zoom:hover { background-position-x:-46px; } .search-item.large .search-action.theasis-zoom { right: 85px; top: 216px; } .search-item.small .search-action.theasis-zoom { right: 52px; top: 216px; } .search-item.small .search-action.lightbox { right: 6px; } .search-item.small .search-action.find-similar { left: 6px; } .theasisSearchResultsEditButton { font-size: 75% !important; padding: 0 2px !important; margin-left: 4px !important; margin-right: 0px !important; } "+hideOriginalLoupe+" </style>").appendTo("head");
		}
	};
	searchResultsChanged = function (event) {
//		console.log("Search results changed");
		if (event.animationName == "theasis_search_results_mods_search_results_updated") {
			window.clearTimeout(window.theasis_search_results_mods_resultschanged_timeoutid);
			window.theasis_search_results_mods_resultschanged_timeoutid = window.setTimeout(highlightMyImages, 300);
			fixLoupe();
			addZoomIcon();
			itemBlurb();
			showCompareFlags();
			showCollection();
		}
	};
	processRoyalty = function (data, id) {
		var html = jQ(data);
		var done = false;
		var hitTotal = jQ("#theasisSearchPageHitTotal").text();
		jQ("table.t td p", html).each(function () {
			var match = jQ(this).text().match(/\$(\d+\.\d+)\s*USD/);
			if (match) {
				var royalty = match[1];
				jQ("#theasis_searchRoyaltySpan" + id).css({
					color: royalty=="0.00" ? "" : "#c00",
					fontWeight: royalty=="0.00" ? "normal" : "bold"
				}).text("$" + royalty);
				var royContainer = jQ("#theasisSearchHitRoyaltyTotal");
				var currentRoy = parseFloat(royContainer.text());
				royContainer.text((currentRoy + parseFloat(royalty)).toFixed(2));
				var countContainer = jQ("#theasisSearchHitRoyaltyCount");
				var currentCount = parseInt(countContainer.text());
				countContainer.text(currentCount + 1);
				if ((currentCount + 1) == parseInt(hitTotal)) {
					jQ("#theasisSearchHitRunningCount").remove();
					done = true;
				}
			}
		});

		var captionWithYear = jQ("div.stats:eq(2) tr:eq(1) td:eq(0)", html).text();
		var match = captionWithYear.match(/(\d{4}):/);
		if (match) {
			theasisStatsYear=match[1];
		}
		jQ("div.stats:gt(1) td div[title]", html).each(function () {
			var mytext = jQ(this).attr("title");
			if (mytext.substr(-2) == " 0") {
				return;
			}
			var tmpVal;
			var mn;
			jQ.each(patterns.royalty, function (key, val) {
				var re = new RegExp(patterns.royalty[key], 'i');
				var matches = mytext.match(re);
				if (matches) {
					mn = mnRev[matches[1]];
					if (typeof mn != "undefined") {
						mn = parseInt(mn);
						tmpVal = parseFloat(matches[2]);
						if (!monthlyRoyalties[mn]) {
							monthlyRoyalties[mn] = {
								total: 0,
								regular: 0,
								sub: 0,
								el: 0,
								gi: 0,
								pp: 0
							};
						}
						monthlyRoyalties[mn].total += tmpVal;
						monthlyRoyalties[mn][key] += tmpVal;
					}
				}
				re = new RegExp(patterns.dl[key], 'i');
				matches = mytext.match(re);
				if (matches) {
					mn = mnRev[matches[1]];
					if (typeof mn != "undefined") {
						mn = parseInt(mn);
						tmpVal = parseFloat(matches[2]);
						if (!monthlyDownloads[mn]) {
							monthlyDownloads[mn] = {
								total: 0,
								regular: 0,
								sub: 0,
								el: 0,
								gi: 0,
								pp: 0
							};
						}
						monthlyDownloads[mn].total += tmpVal;
						monthlyDownloads[mn][key] += tmpVal;
					}
				}
			});
		});
		// End of per-month data scraping

		// Display monthly data:
		jQ("#searchReturnDataMonthly_div").remove();

		element = jQ("<div id='searchReturnDataMonthly_div'/>");
		dlBars = chart(monthlyDownloads);
		royaltylBars = chart(monthlyRoyalties);
		text = '<div>';

		for (var i = 0; i < months.length; i++) {
			var barcount = 0;
			barcount += monthlyDownloads[i].regular ? 1 : 0;
			barcount += monthlyDownloads[i].sub ? 1 : 0;
			barcount += monthlyDownloads[i].el ? 1 : 0;
			barcount += monthlyDownloads[i].gi ? 1 : 0;
			barcount += monthlyDownloads[i].pp ? 1 : 0;
			barwidth = barcount ? 48 / barcount : 0;
			var left = 1;
			barRoy = "";
			barDl = "";
			for (var ki = 0; ki < barKeys.length; ++ki) {
				var key = barKeys[ki];
				if (monthlyDownloads[i][key]) {
					barRoy += '<div title="$' + monthlyRoyalties[i][key].toFixed(2) + ' ' + key + ' royalty" class="theasis_roybar ' + patterns.style[key] + '" style="height: ' + royaltylBars[i][key] + 'px; width: ' + barwidth + 'px; left: ' + left + 'px;"></div>';
					barDl += '<div title="' + monthlyDownloads[i][key] + ' ' + key + ' downloads" class="theasis_dlbar ' + patterns.style[key] + '" style="height: ' + dlBars[i][key] + 'px; width: ' + barwidth + 'px; left: ' + left + 'px;"></div>';
					left += barwidth;
				}
			}
			mroy = monthlyRoyalties[i].total ? monthlyRoyalties[i].total.toFixed(2) : "0.00";
			mdl = monthlyDownloads[i].total || 0;
			text += '<div class="theasis_graphcontainer"' + (i == months.length - 1 ? ' style="margin-left:50px;' : '') + '">';
			text += '<div class="theasis_graphcell">$' + mroy + '<div class="bargraph_main" style="height: ' + royaltylBars[i].total + 'px;">' + barRoy + '</div></div>';
			var monthLabel = mnLabel[i];
			if (i==12 && theasisStatsYear) {
				monthLabel = theasisStatsYear;
			}
			text += '<div style="font-weight: bold; background-color:#' + (i == months.length - 1 ? '333; color:#fff;' : 'ddd;') + '">' + monthLabel + '</div>';
			text += '<div style="display: table-cell; vertical-align: top; height: 150px; width: 50px">' + '<div class="bargraph_main" style="height: ' + dlBars[i].total + 'px">' + barDl + '</div>' + mdl + '</div>';
			text += '</div>';
		}

		text += '</div>';
		text += '<div style="clear:both;" id="theasis_graphlegend">';
		text += '<div style="clear:left;"><span class="bargraph_F" style="width:10px; height:10px; display:inline-block;"/>&nbsp;Regular&nbsp;&nbsp;&nbsp;&nbsp;<span class="bargraph_SUB" style="width:10px; height:10px; display:inline-block;"/>&nbsp;Sub&nbsp;&nbsp;&nbsp;&nbsp;<span class="bargraph_EL" style="width:10px; height:10px; display:inline-block;"/>&nbsp;EL&nbsp;&nbsp;&nbsp;&nbsp;<span class="bargraph_GI" style="width:10px; height:10px; display:inline-block;"/>&nbsp;Getty&nbsp;&nbsp;&nbsp;&nbsp;<span class="bargraph_PP" style="width:10px; height:10px; display:inline-block;"/>&nbsp;Partner&nbsp;&nbsp;&nbsp;&nbsp;<span class="bargraph_main" style="width:10px; height:10px; display:inline-block;"/>&nbsp;Total</div><br><br>';
		text += '</div>';
		element.html(jQ(text));
		var srchContainer = jQ("#theasisSearchHitRoyaltyContainer");
		srchContainer.prepend(element);

		if (done) {
			if (theasisStatsOffset==0) {
				theasisStatsOffset=11;
				jQ("#searchReturnDataMonthly_div").attr("id","completeSearchReturnDataMonthly_div");
				var statsContainer = jQ("#theasisSearchHitRoyaltyContainer");
				statsContainer.attr("id","theasisCompleteSearchHitRoyaltyContainer");
				statsContainer.before("<div id='theasisSearchHitRoyaltyContainer'/>");
				resetMonthlyData();
				addDetailsButton();
			}
		}
		// //////////////////////////////////////////

	};
	loadDetails = function () {
		disableDetailsButton();
		theasisStatsYear='YEAR';
		var hitTotal = jQ("#theasisSearchPageHitTotal").text();
		jQ("#theasisSearchHitRoyaltyContainer").html("<br>Total Royalty: $<span id='theasisSearchHitRoyaltyTotal'>0.00</span><span id='theasisSearchHitRunningCount'> (<span id='theasisSearchHitRoyaltyCount'>0</span> of " + hitTotal + ")</span>");
		var uid = window.theasis_loggedInUserID;
		var uname = window.theasis_loggedInUserName.toLowerCase();
		var divs = jQ('dt.srp-contributor');
		if (divs.length > 0) {
			var attrStr = '/profile/' + uname; // id=' + uid;
			//                      var hits = divs.find('a[href*="'+attrStr+'"]');
			divs.parent().each(function () {
				var div = jQ(this);
				var mine = div.find("dt.srp-contributor a[href*='" + attrStr + "']").length;
				var elId = "";
				var url = "";
				if (mine) {
					var fn = div.find("dt.srp-filenumber").text();
					var match = fn.match(/#(\d+)/);
					if (match) {
						elId=match[1];
					}
					url = "/file_downloads.php?id=" + elId;
					if (theasisStatsOffset) {
						url += "&Offset="+theasisStatsOffset;
					}
				}
				if (theasisStatsOffset==0) {
					var royDiv = div.find(".theasis_srRoyalty");
					var royDivContent = mine ? "Royalty: <span id='theasis_searchRoyaltySpan" + elId + "' style='color:#0c8;'>loading</span>" : "&nbsp;";
					if (royDiv.length == 0) {
						div.parent().append(jQ("<div class='theasis_srRoyalty'>" + royDivContent + "</div>"));
					}
					else {
						royDiv.html(royDivContent);
					}
				}
				if (url) {
					//                                      console.log("ajax with id = " + elId);
					jQ.ajax({
						url: url,
						success: function (data, status, xhr) {
							processRoyalty(data, elId);
						}
					});
				}
			});
			//                      addClickHandlers();
		}
	};
	addDetailsButton = function () {
		var text="Royalty " + (theasisStatsOffset?"Last":"This") + " Year";
		jQ("#theasis_searchRoyaltyDetailsButton").remove();
		var button = jQ("<input id='theasis_searchRoyaltyDetailsButton' type='submit' value='"+text+"' class='btnCta1' style='float:right;padding:3px 7px;font-size:0.6em;'>").click(loadDetails);
		jQ("#search-title-count").after(button);
	};
	disableDetailsButton = function () {
		jQ("#theasis_searchRoyaltyDetailsButton").css({
			background: "#ccc",
			border: "none",
			cursor: "not-allowed"
		}).unbind("click");
	};
	highlightMyImages = function () {
//		console.log("In highlightMyImages: " + window.theasis_searchResults_reloadmonitor + " check:" + theasis_searchResults_reloadcheck);
		var border = 6;
		var perPage = jQ('#perPageTop').val();
		var attrStr = '/profile/' + window.theasis_loggedInUserName.toLowerCase(); // 'id=' + window.theasis_loggedInUserID;
		var disableButton=false;
		window.theasis_search_results_timeout_id = null;
		var divs = jQ('dt.srp-contributor');
		//              console.log("highlightMyImages: divs.length="+divs.length);
		if (divs.length < 1) {
			if (jQ('#zeroResult').length < 1) window.theasis_search_results_timeout_id = window.setTimeout(highlightMyImages, 1000);
		}
		else {
			var hits = divs.find('a[href*="' + attrStr + '"]');
			disableButton=hits.length<1 && !GM_getValue("theasis_searchResults_alwaysShowRoyaltyButton",false);
			jQ("#theasisSearchHitRoyaltyContainer").remove();
			jQ("#theasisSearchHitCountContainer").remove();
			var hitContainer = jQ("#theasisSearchHitCountContainer");
			if (hitContainer.length < 1) {
				hitContainer = jQ("<div id='theasisSearchHitCountContainer'/>");
				jQ("#search-container").prepend(hitContainer);
			}
			hitContainer.after(jQ("<div id='theasisSearchHitRoyaltyContainer'/>"));
			var hitText = "<span id='theasisSearchPageHitTotal'>" + (hits.length == 1 ? "1</span> file is" : hits.length + "</span> files are") + " yours.";
			hitContainer.html(hitText);
			if (hits.length == perPage || hits.length == divs.length) {
				jQ("#theasisSearchHitCountContainer").css({
					background: '#f8ffc0',
					padding: "4px"
				});
			}
			else {
				hits.parent().parent().parent().each(function () {
					var ths = jQ(this);
					var pl = parseFloat(ths.css('padding-left'));
					var newPl = pl - border;
					ths.css({
						background: '#f8ffc0'
					});
					ths.find(".item-details").css({
						background: '#f8ffc0'
					});

				});
			}
			addMyImageButtons(hits);
			//                      addClickHandlers();
		}
		addDetailsButton();
		if (disableButton) {
			disableDetailsButton();
		}
	};
	addMyImageButtons = function(hits) {
		hits.parent().parent().not(function(){return jQ(".theasisSearchResultsEditButton",this).length>0;}).each(function() {
			var ths = jQ(this);
			var fileid=ths.parent().data('fileid');
			jQ("dt.srp-filenumber",ths)
				.append(jQ("<a href='/file_closeup_edit.php?id="+fileid+"'><input type='submit' value='Edit' class='btnCta1 theasisSearchResultsEditButton'></a>"))
				.append(jQ("<a href='/file_downloads.php?id="+fileid+"'><input type='submit' value='DLs' class='btnCta1 theasisSearchResultsEditButton'></a>"));
		});
	};
	addZoomIcon = function() {
		if (GM_getValue("theasis_searchResults_useOriginalLoupe",false)) {
			return;
		}

		jQ("section.search-item-clickable-area").not(function(){return jQ("img.theasis-search-zoom",this).length>0;})
			.append(jQ("<a class='search-action theasis-zoom'><img src='http://i.istockimg.com/static/images/blank.gif' class='theasis-search-zoom' alt='Zoom' title='Zoom'></a>")
				.click(function(e){
					setLoupeBackgroundLoading();
					var me=jQ(this);
					var imgEl=jQ("div.overlay img",me.parent()).eq(0);
					var fileid=me.parent().parent().data("fileid");
//					console.log("adding imgEl " + imgEl);
					loupeZoomTracker(e,imgEl,3);
					window.theasisSearchPage_zoomSize=3;
					loupeZoom(fileid,3);
					imgEl.parent().parent().parent().parent().unbind("mousemove").mousemove(function(e){loupeZoomTracker(e,imgEl,3);});
				})
			);
	};
	setLoupeBackgroundLoading = function() {
		console.log("loupe background loading");
		jQ("#theasisSearchLoupe").css({background:"url('http://i.istockimg.com/static/images/loading.gif') no-repeat","background-position":"center","background-size":"30% auto"});
	};
	fixLoupe = function() {
//		console.log("fixLoupe");
		if (GM_getValue("theasis_searchResults_useOriginalLoupe",false)) {
			return;
		}
		jQ("body").unbind('touchstart');
		jQ("section.search-item-clickable-area").unbind('mouseover').unbind('mouseenter').removeClass("tooltip").mouseenter(function(e){doLoupe(e,jQ(this));}).mouseleave(function(){jQ(this).unbind('mousemove');undoLoupe();});
		jQ(".loupe-preview-display").remove();
//		console.log("fixLoupe done");
	};
	var ZOOMSCALE=[0,2.6,5.2,8.0];
	loupeZoomTracker = function(e,imgEl,size) {
//		console.log("loupeZoomTracker");
		var thumbSize=jQ("#thumbnail-toggle img.active").data("size");
		var scale=thumbSize=="large"?0.6:1;
		var pos=imgEl.parent().parent().parent().parent().offset();
		var x=-(e.pageX-pos.left)*ZOOMSCALE[size]*scale+60;
		var y=-(e.pageY-pos.top)*ZOOMSCALE[size]*scale+220;
		jQ("#theasisSearchLoupe img:first").css({top:y+"px",left:x+"px",position:"relative"});
	};
	loupeLoaded = function(e,fileid,imgEl) {
//1		console.log("loupeLoaded");
		if (window.theasisSearchPage_zoomSize>0) {
				loupeZoom(fileid,window.theasisSearchPage_zoomSize);
				imgEl.parent().parent().parent().parent().unbind("mousemove").mousemove(function(e){loupeZoomTracker(e,imgEl,window.theasisSearchPage_zoomSize);});
		}
		jQ(document).keydown(function(e){
			var size=-1;
			switch(e.keyCode) {
			case 49: size=1; break;
			case 50: size=2; break;
			case 51: size=3; break;
			}
			if (size>0 && size!=window.theasisSearchPage_zoomSize) {
//				jQ(document).unbind('keydown');
				setLoupeBackgroundLoading();
				window.theasisSearchPage_zoomSize=size;
				loupeZoom(fileid,size);
//				imgEl.parent().unbind("mousemove").mousemove(function(e){loupeZoomTracker(e,imgEl,size);});
//				imgEl.parent().parent().unbind("mousemove").mousemove(function(e){loupeZoomTracker(e,imgEl,size);});
//				imgEl.parent().parent().parent().unbind("mousemove").mousemove(function(e){loupeZoomTracker(e,imgEl,size);});
				imgEl.parent().parent().parent().parent().unbind("mousemove").mousemove(function(e){loupeZoomTracker(e,imgEl,size);});
			}
		});
	};
	loupeZoom = function(fileid,size) {
		window.theasisSearchPage_loadingZoomImageId=fileid;
		window.theasisSearchPage_loadingZoomImageSize=size;
		var cell = jQ("#theasisSearchLoupe");
		var jImg = jQ('img:first',cell);
		var src = jImg.attr("src");
		
		var img = jImg[0];
		jQ("<img/>").load(function(){
			if (window.theasisSearchPage_loadingZoomImageId!=fileid || window.theasisSearchPage_loadingZoomImageSize!=size) {
//				console.log("discarding " + fileid + " " + size);
				return;
			}
			var w = this.width;
			var h = this.height;
			try {
				var match = src.match(/image-zoom\/\d+\/\d\/(\d+)\/(\d+)\//);
				if (match) {
					w=match[1];
					h=match[2];
				}
			} catch(err) {
				// don't care
			}
			var zUrl = "/image-zoom/"+fileid+"/"+size+"/"+w+"/"+h+"/zoom-"+fileid+"-"+size+".jpg";
	//		img.unbind('load');
			if (w>0 && h>0) {
				cell.css({width:"380px",height:"380px",position:"relative",overflow:"hidden"}).empty().append(jQ("<img src='"+zUrl+"'/>").load(function(){jQ("#theasisSearchLoupe").css("background","transparent");}));
//				jImg.attr("src",zUrl);
			}
		}).attr("src",src);
	};
	doLoupe = function(e,searchEl) {
//		console.log("doLoupe");
		fixLoupe();
		doStyle();
		undoLoupe();
		var addStyle=true;
		var lImg=380;
		var lBuffer=80;
		var tSize=220;
		var lMax=lImg+lBuffer;
		var loupeHeight=lMax;
		var loupeWidth=lImg;
		var fileid=searchEl.parent().data("fileid");
		var imgEl=jQ("div.overlay img",searchEl).eq(0);
		window.theasisSearchResultsFileId=fileid;
		try {
			loupeHeight = Math.min(lMax,Math.floor(lImg*imgEl.height()/imgEl.width()+lBuffer));
			loupeWidth = Math.min(lImg,Math.floor(lImg*imgEl.width()/imgEl.height()));
		} catch (err) {
			// fall back to lMax and lImg - no worries!
			debug("doLoupe: Falling back to default image sizes");
		}
		var l=imgEl.offset().left;
		if (l<(lImg+220)) {
			l+=tSize;
		} else {
			l-=420;
		}
		var t=imgEl.offset().top-jQ(window).scrollTop();
		t=Math.max(t,lBuffer);
		if (t > jQ(window).height()-loupeHeight-100) {
			t = jQ(window).height()-loupeHeight-120;
			if (t<1) {
				t=1;
			}
		}
		var imgUrl=imgEl.attr('src').replace(/\/[13]\//,'/2/');
		var style = {position:"fixed",left:l,top:t,"z-index":"50000"};
		var loupeContainer = jQ("<div id='theasis_searchResults_loupe'><div id='theasisSearchLoupe' style='vertical-align:top;'/><div id='theasisLoupeDescription'/></div>").css(style);//.addClass("loupe");
		if (addStyle) {
			var extraStyle={"background-color":"rgba(243,243,243,0.6)",color:"#363636",padding:"5px",border:"0","z-index":"40000","-moz-box-shadow":"0 0 8px 0 rgba(102,102,102,0.5)","-webkit-box-shadow":"0 0 8px 0 rgba(102,102,102,0.5)","box-shadow":"0 0 8px 0 rgba(102,102,102,0.5)","-webkit-border-radius":"5px","-moz-border-radius":"5px","border-radius":"5px"};
			loupeContainer.css(extraStyle);
		}
		loupeContainer.hide();
		loupeContainer.appendTo('body');
		jQ("#theasis_searchResults_loupe_img").remove();
		var loupe = jQ("<img id='theasis_searchResults_loupe_img'>").appendTo(jQ("#theasisSearchLoupe")).load(function(e){loupeLoaded(e,fileid,imgEl);});
		loupe.attr({src:imgUrl});
		loupeContainer.stop().show(100);
		jQ(".loupe").css({visibility:"hidden",display:"none"});
		//console.log("imgEl", imgEl.html());
		var itemContainer = imgEl.parent().parent().parent().parent().parent();
		//console.log("itemContainer: " + itemContainer.html());
		var desc=jQ(".search-item-details",itemContainer).clone();
		//console.log("loupe desc: " + desc.html());
		desc.css({display:"block","background-color":"rgba(243,243,243,0.9)","font-size":"1.1em"});
		jQ("#theasisSearchLoupe").append(desc);
		return;
	};
	itemBlurb = function() {
		var loc = window.location.pathname;
		var crown='<img src="http://i.istockimg.com/static/images/blank.gif" class="icons photoExclusive" alt="Exclusive" title="Exclusive">';
		jQ("section.search-item").each(function(){
			var me=jQ(this);
//			me.find("img.search-editorial").removeClass("search-editorial").addClass("editorial icons");
//			var txt=me.html().replace("Only from iStock",crown);
//			me.html(txt);
			if (loc.indexOf('/search/lightbox/')==0 && jQ('.e_lightboxRemoveFile',me).length==0) {
				var fid=me.data('fileid');
				if (fid) {
					me.prepend(jQ('<img src="http://i.istockimg.com/static/images/blank.gif" class="e_lightboxRemoveFile '+fid+' search-remove-from-lightbox theasisRemoveFromLightboxIcon" />'));
				}
			}
			if (false && jQ('.addToLightboxTrigger',me).length==0) {	
				var fid=me.parent().data('fileid');
				if (fid) {
					me.append(jQ('<a href="#" class="addToLightboxTrigger" data-file-id="'+fid+'"><img src="http://i.istockimg.com/static/images/blank.gif" class="search-add-to-lightbox theasisAddToLightboxIcon" /></a>'));
				}
			}
		});
	};
	showCompareFlags = function() {
		if (!GM_getValue("theasis_searchResults_showLargeThumbs",true)) return;
		jQ("figure.item-default").each(function(){
			var me=jQ(this);
			var parent = me.parent().parent();
			var fid=parent.data('fileid');
			if (jQ("#theasisCompareFlag_"+fid,parent).length==0) {
				parent.prepend(jQ('<img src="http://i.istockimg.com/static/images/blank.gif" id="theasisCompareFlag_'+fid+'" class="icons scWhiteFlag" />').click(function(){
					compareImage(jQ(this),fid);
				}));
			}
		});
	};
	showCollection = function() {
//		console.log("showCollection");
		var ilScript=jQ("script:contains('istock.search.event.INITIAL_LOAD')").text();
		if (ilScript) {
			ilScript=ilScript.substring(ilScript.indexOf('istock.search.event.INITIAL_LOAD'));
//			var end=ilScript.indexOf('Event.observe');
//			console.log(" end:"+end);
//			if (end>=0) {
//				console.log("end");
//				var ilStr=ilScript.substring(0,end);
				var match=ilScript.match(/(\{.*\})\s*\);\s*\}\);/m);
				if (match.length==2) {
					var ilObj=JSON.parse(match[1]);
					if (ilObj && ilObj.results) {
						processCollectionArray(ilObj.results);
					}
				}
//			}
		}
	};
	processCollectionArray = function(results) {
		for(var i=0;i<results.length;++i) {
			var result=results[i];
			var collection='?';
			var colClass='';
			if (result.collection=='essentials') {
				collection='E';
				colClass='theasisCollectionIndicatorMain';
			} else if (result.collection=='signature') {
				collection='S';
				colClass='theasisCollectionIndicatorSig';
			} else if (result.collection=='signature+') {
				collection='+';
				colClass='theasisCollectionIndicatorPlus';
			} else if (result.collection.substring(0,5)=='vetta') {
				collection='V';
				colClass='theasisCollectionIndicatorVetta';
			}
			var cell=jQ("section.search-item[data-fileid='"+result.id+"']");
			var colSpan=jQ('span.theasisCollectionIndicator',cell);
			if (colSpan.length>0) {
				colSpan.text(collection);
			} else {
				jQ("section.search-item[data-fileid='"+result.id+"']").prepend("<span class='theasisCollectionIndicator "+colClass+"' title='"+result.collection+"'>"+collection+"</span>");
			}
			if (result.realdownloadcount && result.realdownloadcount!=result.downloads) {
				jQ('dt.srp-downloads',cell).text("Downloads: "+result.realdownloadcount);
			}
		}	
	};
	compareImage = function(me,fid) {
		if (me.hasClass("scWhiteFlag")) {
			me.removeClass("scWhiteFlag").addClass("scFlag");
			me.addClass("theasisCompareRedFlag_"+fid);
			addToCompareContainer(fid);
		} else {
			removeFromCompareContainer(fid,me);
		}
	};
	addToCompareContainer = function(fid) {
		if (jQ("#theasisCompareContainer").length==0) {
			var searchFacets=jQ("#search-facets");
			window.theasisSearchFacetsOldWidth=searchFacets.css("width");
			searchFacets.css({width:"390px"}).prepend("<section id='theasisCompareContainer'><h3>Large Thumbnails</h3></section>");
			var searchResults=jQ("#search-results");
			window.theasisSearchResultsOldMarginLeft=searchResults.css("margin-left");
			searchResults.css({"margin-left":"410px"});
		}
		var imgDiv=jQ("<div class='theasisCompareThumbContainer clear' id='theasisCompareImageContainer_"+fid+"'><a href='/stock-photo-"+fid+"-.php'><img class='theasisCompareThumb clear' id='theasisCompareImage_"+fid+"' src='http://i.istockimg.com/file_thumbview_approve/"+fid+"/2/stock-photo-"+fid+".jpg'/></a></div>").hide();
		var dismissButton=jQ("<img src='http://i.istockimg.com/static/images/blank.gif' class='small-close-button theasisCompareThumbDismiss'/>").click(function(){removeFromCompareContainer(fid);});
		imgDiv.append(dismissButton);
		jQ("#theasisCompareContainer").append(imgDiv);
		imgDiv.show(400);
	};
	removeFromCompareContainer = function(fid) {
		jQ("#theasisCompareImageContainer_"+fid).hide(50).remove();
		if (jQ("#theasisCompareContainer img").length==0) {
			jQ("#theasisCompareContainer").remove();
			jQ("#search-facets").css({"width":window.theasisSearchFacetsOldWidth});
			jQ("#search-results").css({"margin-left":window.theasisSearchResultsOldMarginLeft});
		}
		jQ(".theasisCompareRedFlag_"+fid).removeClass("scFlag").addClass("scWhiteFlag");
	};
	undoLoupe = function() {
		jQ("#theasis_searchResults_loupe").remove();
		jQ(document).unbind('keydown');
		window.theasisSearchPage_zoomSize=0;
	};
	doPrefs = function() {
		theasisPrefs.setup("Theasis Search Results");
		theasisPrefs.addCheckbox("theasis_searchResults_alwaysShowRoyaltyButton","Don't disable the Royalty button",false);
		theasisPrefs.addCheckbox("theasis_searchResults_useOriginalLoupe","Use the standard iStock loupe",false);
		theasisPrefs.addCheckbox("theasis_searchResults_showLargeThumbs","Show flags to select large thumbnails",true);
	};
	////////////////////////////////////////////

//	console.log("Search Results Mod entry");
	loc = window.location.pathname;
	window.theasis_searchResults_reloadmonitor=new Date().getTime();
	theasis_searchResults_reloadcheck = window.theasis_searchResults_reloadmonitor;
	
	if (loc.indexOf("/my-account/preferences")>-1) {
		doPrefs();
	} else {
		var user_details = loggedInUser();
		window.theasis_loggedInUserID = user_details[0];
		window.theasis_loggedInUserName = user_details[1];
		doStyle();
		fixLoupe();
		addZoomIcon();
		addClickHandlers();
		highlightMyImages();
		itemBlurb();
		showCompareFlags();
		showCollection();
	}
}

// load jQuery and kick off the meat of the code when jQuery has finished loading

function addJQuery(callback) {

	var chromestore = true;
	if (chromestore) {
		// chrome store install
		window.jQ = jQuery.noConflict(true);
		main();
	}
	else {
		// manual install
		if (window.top != window.self) {
			// in iframe
			return;
		}
		var script = document.createElement("script");
		script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js");
		script.addEventListener('load', function () {
			var script = document.createElement("script");
			script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
			document.body.appendChild(script);
		}, false);
		document.body.appendChild(script);
	}

}

var theasis_searchResults_reloadcheck;
addJQuery(main);
