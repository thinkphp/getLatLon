<?php
 
   $ip = isset($_GET['ip']) ? $_GET['ip'] : '';

   header("Content-Type: application/xml");
 
   $url = "http://api.ipinfodb.com/v2/ip_query.php?key=9fa9c90700b942bbbbbeb19decb33a591140386d2d407d335c46467703002e0b&ip=".$ip;

   $data = get($url);

   function get($url) {
          $ch = curl_init();
          curl_setopt($ch,CURLOPT_URL,$url);
          curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
          curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,2);
          $data = curl_exec($ch);
          if(empty($data)) {
            return 'System Timeout.Please try again!'; 
          } else {
            return $data;
          }
   } 
   echo$data;
?>