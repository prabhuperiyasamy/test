function submitForm() {
    var aa = document.getElementById("form-section"),
        form = document.getElementById("webinar-form")

    aa.classList.toggle("toogle-success")

    setTimeout(() => {
        aa.classList.toggle("toogle-success");
        form.reset();
    }, 3000);
}

// document.addEventListener("click", function (e) {
//     e.stopPropagation();
//     console.log("You did it!");
// });

// function createFcn(nm){(window.freshsales)[nm] = function () { (window.freshsales).push([nm].concat(Array.prototype.slice.call(arguments, 0))) }; } (function(url,appToken,formCapture){window.freshsales = window.freshsales || [];if(window.freshsales.length==0){list = 'init identify trackPageView trackEvent set'.split(' ');for(var i=0;i<list.length;i++){var nm=list[i];createFcn(nm);}var t=document.createElement('script');t.async=1;t.src='//assets.freshsales.io/assets/analytics.js';var ft=document.getElementsByTagName('script')[0];ft.parentNode.insertBefore(t,ft);freshsales.init('https://akshay2.myfreshworks.com/crm/sales','3350967909b621542c29092f82b4b7129dd5bd161da1d3ab81c290c0df5a03ae',true);}})();</script>

// function createFcn(nm) { (window.freshsales)[nm] = function () { (window.freshsales).push([nm].concat(Array.prototype.slice.call(arguments, 0))) }; }(function (url, appToken, formCapture) { window.freshsales = window.freshsales || []; if (window.freshsales.length == 0) { list = 'init identify trackPageView trackEvent set'.split(' '); for (var i = 0; i < list.length; i++) { var nm = list[i]; createFcn(nm); } var t = document.createElement('script'); t.async = 1; t.src = '//euc-assets.freshsales.io/assets/analytics.js'; var ft = document.getElementsByTagName('script')[0]; ft.parentNode.insertBefore(t, ft); freshsales.init('https://cpqaddon-ga-eu.myfreshworks.com/crm/sales', '537bab26c2527e0f16698a5e4f0d451a34469e55246c8a78eba6aed3409d0ddf', true); } })();

// function createFcn(nm) {
//     (window.freshsales)[nm] = function () {
//         (window.freshsales).push([nm].concat(Array.prototype.slice.call(arguments, 0)))
//     };
// } (function (url, appToken, formCapture) {
//     window.freshsales = window.freshsales || [];
//     if (window.freshsales.length == 0) {
//         list = 'init identify trackPageView trackEvent set'.split(' ');
//         for (var i = 0; i < list.length; i++) {
//             var nm = list[i];
//             createFcn(nm);
//         }
//         var t = document.createElement('script');
//         t.async = 1;
//         t.src = 'https://assets.freshsales.io/assets/analytics.js';
//         var ft = document.getElementsByTagName('script')[0];
//         ft.parentNode.insertBefore(t, ft);
//         freshsales.init('https://topprcrm.freshworks.com/crm/sales', '854b081f450921b983cc9e8b34c411f292ca4137010515d421c4aacba30a661b', true);
//     }
// })();
