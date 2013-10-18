# JavaScript blocking
These demos demonstrates two blocking issues which should be avoided when writing web-applications.
## Download blocking
When the HTML parser finds a `<script>` reference all parsing stops. This is because a script can alter the actual content of the page, so the parser stops dead, fetches, parses and executes the script before parsing can continue. This means that if you have a script reference in the header of the page, this script will block the browser from drawing anything to the screen. Let's consider the following example:
```html
<!DOCTYPE html>
<html>
	<head>
		<title>The wrong way!</title>
		<meta charset="UTF-8">
		<script type="text/javascript" src="slow.js"></script>
	</head>
	<body>
		<p>Awesome text</p>
		<img src="images/img1.jpg" width="250" height="166" alt="Image" />
		.....
	</body>
</html>
```

## UI - Thread blocking
blah
![alt_text][jsblocking_bad]
![alt_text][jsblocking_better]
![alt_text][jsblocking_best]

[jsblocking_bad]: ../_resources/jsblocking_bad.jpg "Bad"
[jsblocking_better]: ../_resources/jsblocking_better.jpg "Better"
[jsblocking_best]: ../_resources/jsblocking_best.jpg "Best"