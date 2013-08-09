google_alerts_creator
=====================


Notes
-----
- A class for creating Google Alerts in bulk ( even though there is not an official API ).
- Based on this Stack Overflow question and answer
	- http://stackoverflow.com/questions/13528747/how-to-create-new-google-alert-delivering-it-to-feed-using-php-curl


Usage
-----
1. copy `config.php.example` to `config.php`
	- add your google account credentials
	- set your desired alert settings
2. copy `queries.txt.example` to `queries.txt`
	- add your alert queries to this file, one per line
3. execute `create_google_alerts.php`