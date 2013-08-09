<?php

	require( dirname( __FILE__ ) . '/google_alerts_class.php' );
	
	$Ga = new Google_alerts_class();
	
	$query_file_contents = file_get_contents( dirname( __FILE__ ) . '/queries.txt' );
	$queries = explode( "\n", $query_file_contents );
	
	foreach( $queries as $query ) {
		echo "\n  - '$query' Alert Created";
		$Ga->createAlert( $query );
	}
	
	echo "\n\n";

?>