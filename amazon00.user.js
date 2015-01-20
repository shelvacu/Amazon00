// ==UserScript==
// @name        Amazon00
// @namespace   http://github.com/shelvacu/Amazon00
// @description Turns .99 into 1.00
// @author      Shelly the Vacu
// @version     0.0.2f
// @include     https://*.amazon.tld
// @include     http://*.amazon.tld
// @include     https://*.amazon.tld/gp/product/*
// @include     http://*.amazon.tld/gp/product/*
// @grant       none
// @require 	http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

var PRICE_ROUNDING_DIVISOR = 2; //Fifty-cent increments

//window.amazon00Extension = this; //DEBUG

//Currently amazon doesn't use jquery, but just in case:
this.$ = this.jQuery = jQuery.noConflict(true);

function round(num, divisor){ //round to the nearest division
    if(num > (1-(1/divisor)))
		return (Math.round(num*divisor)/divisor).toFixed(2);
    return num;
}

var myRe = /\$([0-9,]+\.\d{2})/;
function changeAll(el){
    if(el === undefined)
	el = document.body;
    
    $(el).find('.s-price,'+
	       '.price,'+
	       '.a-color-price,'+
	       '.pa-sp-buy-price,'+
	       '.pa-sp-list-price,'+
	       '.a-text-strike,'+
	       '.pricing>.listprice,'+
	       '.pricing>.price,'+
	       '#ourprice_shippingmessage .a-color-secondary.a-size-base,'+
	       '.shipping3P').each(function(i,el){
	var s = $(this).text();
	//console.log(s);
	var match = myRe.exec(s);
	if(match !== null){
	    //console.log(match);
	    $(this).text($(this).text().replace(match[0],"$"+round(match[1],PRICE_ROUNDING_DIVISOR)));
	}
    });
}
changeAll();

//Amazon injects some ads at the bottom (labelled 'sponsored') which are not caught by this

var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
	//console.log(mutation);
	changeAll(mutation.target);
    });
});

observer.observe($('#click_withinLazyLoad_tower.searchBreakAUI')[0],{
    childList: true,
    subtree: true
});

