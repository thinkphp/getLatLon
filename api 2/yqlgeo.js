var yqlgeo = function(){
    var callback;
    function get() {

       var args = arguments;

       for(var i=0;i<args.length;i++) {
            if(typeof args[i] === 'function') {
                 callback = args[i];
            }//endif
       }//endfor

       if(args[0] === 'ipvisitor') {
            grabIP();
       };//endif

       if(args[0] === 'visitor') {
              getVisitor();  
       }//endif

       if(typeof args[0] === 'string' && args[0] != 'visitor' && args[0] != 'ipvisitor') {

          if(args[0]) {

             if(/^http:\/\/.*/.test(args[0])) {

                getFromUrl(args[0]);

             } else if(/^[\d+\.?]+$/.test(args[0])) {

                getFromIP(args[0]);

             } else {

                getFromText(args[0]);
             }
          }//endif
       }//endif

       var lat = args[0], lon = args[1];
       if(typeof lat.join !== "undefined" && args[0][1]) {                              
           lat = args[0][0];
           lon = args[0][1]; 
       }//endif

       if(isFinite(lat) && isFinite(lon)){
          if(lat>-90 && lat<90 && lon>-180 && lon<180){
             getFromLatLon(lat,lon);
          }//endif
       }//endif
    };//end function 

    function getFromText(text) {
        var yql = "select * from geo.places where woeid in (select match.place.woeId from geo.placemaker where documentContent='"+text+"' and documentType='text/plain' and appid='')"; 
        if(window.console) {console.log(yql);}
        load(yql,'yqlgeo.retrieved'); 
    };

    function getFromUrl(url) {
        var yql = "select * from geo.places where woeid in (select match.place.woeId from geo.placemaker where documentURL='"+url+"' and documentType='text/html' and appid='')";                                                                    
        if(window.console) {console.log(yql);}
        load(yql,'yqlgeo.retrieved');
    };

    function getFromIP(ip) {
        var yql = "select * from geo.places where woeid in (select place.woeid from flickr.places where (lat,lon) in (select Latitude,Longitude from ip.location where ip='"+ip+"' and key='9fa9c90700b942bbbbbeb19decb33a591140386d2d407d335c46467703002e0b'))";
        if(window.console) {console.log(yql);}
        load(yql,'yqlgeo.retrieved');           
    };

    function retrieved(o){
        if(o.query.results) {
             callback(o.query.results);
        } else {
             callback({error: o.query});
        }
    };//end function

    function getVisitor() {
        if(navigator.geolocation && /Gecko\/(\S*)/.test(navigator.userAgent)) {
           navigator.geolocation.getCurrentPosition(
              function(position) {
                  getFromLatLon(position.coords.latitude,position.coords.longitude);
              },
              function(error) {
                  retrieveIP();
              }
           );
         } else {
            retrieveIP();
         }
    };

    function retrieveIP(){
        jsonp('http://jsonip.appspot.com/?callback=yqlgeo.ipin');
    };//end function

    function grabIP(){
        jsonp('http://jsonip.appspot.com/?callback=yqlgeo.ipgrab');
    };//end function

    function ipin(o) {
        getFromIP(o.ip);  
    };//end function

    function ipgrab(o) {
        if(o.ip) {
           callback({ip: o.ip});
        } else {
           callback({error: 'Internal Error'});
        }
    };//end function

    function jsonp(src) {
       if(document.getElementById('yqlgeodata')) {
            var old = document.getElementById('yqlgeodata');
            old.parentNode.removeChild(old);
        }
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('script');
            s.setAttribute('id','yqlgeodata');
            s.setAttribute('src',src);
            head.appendChild(s); 
    };//end function

    function getFromLatLon(lat,lon) {
        var yql = "select * from geo.places where woeid in (select place.woeid from flickr.places where lat='"+lat+"' and lon='"+lon+"')";
        if(window.console) {console.log(yql);}
        load(yql,'yqlgeo.retrieved');  
    };//end function

    function load(yql,cb) {
        if(document.getElementById('yqlgeodata')) {
            var old = document.getElementById('yqlgeodata');
            old.parentNode.removeChild(old);
        }
        var src = 'http://query.yahooapis.com/v1/public/yql?q='+
                   encodeURIComponent(yql) + '&format=json&callback='+ cb + '&'+ 
                   'env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'; 
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('script');
            s.setAttribute('id','yqlgeodata');
            s.setAttribute('src',src);
            head.appendChild(s);
    };//end function

 return{get: get,retrieved: retrieved,ipin: ipin,ipgrab: ipgrab};
}();