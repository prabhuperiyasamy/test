function createFcn(nm) {
    (window.freshsales)[nm] = function () {
        (window.freshsales).push([nm].concat(Array.prototype.slice.call(arguments, 0)))
    };
} (function (url, appToken, formCapture) {
    window.freshsales = window.freshsales || [];
    if (window.freshsales.length == 0) {
        list = 'init identify trackPageView trackEvent set'.split(' ');
        for (var i = 0; i < list.length; i++) {
            var nm = list[i];
            createFcn(nm);
        }
        var t = document.createElement('script');
        t.async = 1;
        t.src = 'https://assets.freshsales.io/assets/analytics.js';
        var ft = document.getElementsByTagName('script')[0];
        ft.parentNode.insertBefore(t, ft);
        freshsales.init("https://prabhu-675398458834092915.myfreshworks.com/crm/sales","1f4994ff64fc7f7ef9023fde54c1e5e30c9bb81c4e7882be30acb04237067d4f", true);
    }
})();