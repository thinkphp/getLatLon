/* Use Asynchronous JavaScript and XML for retrieve IP of the user and some data */

var AJAX = {

       getXHR: function() {

               var xml;

               if(window.ActiveXObject) {
 
                    try {
 
                          xml = new ActiveXObject("Microsoft.XMLHTTP"); 
                         
                        } catch(e) {

 
                             try{

                                 xml = new ActiveXObject("Msxml2.XMLHTTP");

                                }catch(e) {

                                    xml = false;
                                }
                        }


               } else if(window.XMLHttpRequest) {

                       try {

                            xml = new XMLHttpRequest();

                           } catch(e) { xml = false;}
               }

               if(!xml) {alert('The Browser does not support AJAX. Consider upgrading the browser!');} 

                       else

                        {return xml;}
       },

       handleResponse: function(xml,callback) {
           if(callback) {callback(xml.responseXML);}
       },
       handleFailed: function(xml,callback) {
           if(callback) {callback('error');}        
          return true;
       },

       doXHR: function(url,callback) {

            var xml = AJAX.getXHR(); 

            var sid = new Date().getTime();

                xml.open("GET", url, true);

                xml.onreadystatechange = function() {

                       if(xml.readyState == 4) {

                              if(xml.status && /200|304/.test(xml.status)) {

                                        AJAX.handleResponse(xml,callback);

                              } else AJAX.handleFailed(xml,callback);
                       } 
                };
     
                xml.send(null);

           return false;
       }
};
