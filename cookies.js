/******************************************************************
//this goes in the parent html page that embeds the svg
// NEED CLOSING TAG! 
<script src="cookies.js" ></script>

// call function in svg script
try{
if ( g_parentDoc )
	checkCookie(); //eg
}catch(e){}
********************************************************************/
var g_parentDoc = document;

function getCookie( c_name )
{
	if ( g_parentDoc.cookie && g_parentDoc.cookie.length > 0 )
	{ 
		var c_start = g_parentDoc.cookie.indexOf( c_name + "=" );
		
		if ( c_start != -1)
		{ 
			c_start = c_start + c_name.length + 1; 
			var c_end = g_parentDoc.cookie.indexOf( ";", c_start );
			
			if ( c_end == -1 ) 
				c_end = g_parentDoc.cookie.length;
				
			return unescape( g_parentDoc.cookie.substring( c_start, c_end ) );
		} 
	}
	
	return null;
}

function setCookie( c_name, value, expiredays )
{
	var exdate = new Date();
	exdate.setDate( exdate.getDate() + expiredays );
	
	g_parentDoc.cookie = c_name + "=" + escape(value) + ( (expiredays==null) ? "" : "; expires=" + exdate );
}


// example function
function checkCookie()
{
	var username = getCookie( 'username' );
	
	if ( username != null )
	{
		alert( 'Welcome again ' + username + '!' );
	}
	else 
	{
		username = prompt( 'Please enter your name:', "" );
		
		if ( username!=null && username != "" )
		{
			setCookie( 'username', username, 365 );
		}
	}
}

