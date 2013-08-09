<?php

	require( dirname( __FILE__ ) . '/config.php' );

	class Google_alerts_class
	{
		
		public function createAlert( $search ) {
	
	        $ch = curl_init();
	        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
	        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)");
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	        curl_setopt($ch, CURLOPT_COOKIEJAR, GOOGLE_COOKIEFILE);
	        curl_setopt($ch, CURLOPT_COOKIEFILE, GOOGLE_COOKIEFILE);
	        curl_setopt($ch, CURLOPT_HEADER, 0);
	        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
	        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
	
	        curl_setopt($ch, CURLOPT_URL,
	        'https://accounts.google.com/ServiceLogin?hl=en&service=alerts&continue=http://www.google.com/alerts/manage');
	        $data = curl_exec($ch);
	
	        $formFields = $this->getFormFields( $data );
	
	        $formFields['Email']  = GOOGLE_USERNAME;
	        $formFields['Passwd'] = GOOGLE_PASSWORD;
	        unset($formFields['PersistentCookie']);
	
	        $post_string = '';
	        foreach($formFields as $key => $value) {
	        	$post_string .= $key . '=' . urlencode($value) . '&';
	        }
	
	        $post_string = substr($post_string, 0, -1);
	
	        curl_setopt($ch, CURLOPT_URL, 'https://accounts.google.com/ServiceLoginAuth');
	        curl_setopt($ch, CURLOPT_POST, 1);
	        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
	
	        $result = curl_exec($ch);
	
	        if (strpos($result, '<title>Redirecting') === false) {
	            var_dump($result);
	            die("Login failed");
	        } else {

	            curl_setopt($ch, CURLOPT_URL, 'http://www.google.com/alerts');
	            curl_setopt($ch, CURLOPT_POST, 0);
	            curl_setopt($ch, CURLOPT_POSTFIELDS, null);
	
	            $result = curl_exec($ch);
	
	            // Create alert
	
	            preg_match('/<input type="hidden" name="x" value="([^"]+)"/', $result, $matches);
	
	            $post = array(
	                "x" => $matches[1],			// anti-XSRF key
	                "q" => $search,				// Search term  
	                "t" => ALERT_RESULT_TYPE,	// Result type: 7-everything, 8-discussions
	                "f" => ALERT_FREQUENCY,		// Frequency: 0: as it happens, 1: daily, 6: weekly
	                "l" => ALERT_QUALITY,		// All results: 1, best results: 0
	                "e" => GOOGLE_USERNAME		// Type of delivery: rss: "feed"
	            );
	
	            $post_string = '';
	
	            foreach($post as $key => $value) {
	                $post_string .= $key . '=' . urlencode($value) . '&';
	            }
	
	            $post_string = substr($post_string, 0, -1);
				
	            curl_setopt($ch, CURLOPT_URL, 'http://www.google.com/alerts/create');
	            curl_setopt($ch, CURLOPT_POST, 1);
	            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
	
	            $result = curl_exec($ch);
	            $matches = array();
	            preg_match('#<a href="(http://www.google.com/alerts/feeds/[\d/]+)"#', $result, $matches);
	
	            $top_alert = $matches[1];
	
	            return $top_alert;
	        }
	    }
	
	
	    private function getFormFields($data)
	    {
	        if (preg_match('/(<form.*?id=.?gaia_loginform.*?<\/form>)/is', $data, $matches)) {
	            $inputs = $this->getInputs($matches[1]);
	
	            return $inputs;
	        } else {
	            die("didn't find login form");
	        }
	    }
	
	    private function getInputs($form)
	    {
	        $inputs = array();
	
	        $elements = preg_match_all('/(<input[^>]+>)/is', $form, $matches);
	
	        if ($elements > 0) {
	            for($i = 0; $i < $elements; $i++) {
	                $el = preg_replace('/\s{2,}/', ' ', $matches[1][$i]);
	
	                if (preg_match('/name=(?:["\'])?([^"\'\s]*)/i', $el, $name)) {
	                    $name  = $name[1];
	                    $value = '';
	
	                    if (preg_match('/value=(?:["\'])?([^"\'\s]*)/i', $el, $value)) {
	                        $value = $value[1];
	                    }
	
	                    $inputs[$name] = $value;
	                }
	            }
	        }
	
	        return $inputs;
	    }

	} // end class	    

?>