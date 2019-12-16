var svgDoc;
var numRows = 4;
var numCols = 4;
var numSpaces = numRows * numCols;
var tilePos = 25;
var tileSize = 50;
var tileArray;
var gridArray;
var g_movingTile = null;

function onLoad(evt)
{
	svgDoc = evt.target.ownerDocument;

	// aray for the grid of tiles in each position
	gridArray = new Array( numCols );

	for ( var x = 0; x < numCols ; x++ )
	{
		gridArray[x] = new Array( numRows ); 
	}

	// create the tiles 
	var elem = svgDoc.getElementById( "temp_tile" );

	// the tiles are stored here in numerical order
	tileArray = new Array( numRows * numCols );
	
	for ( var tiles = 0; tiles < numSpaces - 1; tiles++ )
	{
		tileArray[tiles] = new TileObject( elem, ( tiles + 1 ) );
	}

	Reset();
	
	//try {
	//if ( g_parentDoc )
	//	alert( g_parentDoc );
	//}catch(e){}
}

function Reset()
{
	var tempAr = new Array( numSpaces );

	// position the tiles
	for ( var i = 0; i < numSpaces; i++ )
	{
		var test = Math.floor( Math.random() * ( numSpaces -1 ) );

		for ( var c = 0; c < numSpaces + 1; c++ ) // be safe
		{
			if ( tempAr[test] == undefined )
			{
				tempAr[test] = i;
				break;
			}
			
			if( ++test >= numSpaces ) 
				test = 0;
		}

		var y = test % numCols;
		var x = Math.floor( test / numCols );

		gridArray[x][y] = tempAr[test]; 

		if ( tempAr[test] > 0 )
			tileArray[ tempAr[test] - 1 ].setPos( x, y );
	}
	
	// hide the message		
	svgDoc.getElementById( "win_message" ).setAttribute( "display", "none" );

}

function PressReset(evt)
{
	var shadow1 = svgDoc.getElementById( "button_shadow1" );
	var shadow2 = svgDoc.getElementById( "button_shadow2" );
		
	//shadow1.setAttribute( "display", "inline" );
	shadow2.setAttribute( "transform", "translate(-2,-2)" );
	shadow1.setAttribute( "transform", "translate(1,1)" );

	Reset();
}
      
function ReleaseButton(evt)
{
	var shadow1 = svgDoc.getElementById( "button_shadow1" );
	var shadow2 = svgDoc.getElementById( "button_shadow2" );
		
	//shadow1.setAttribute( "display", "none" );
	shadow1.setAttribute( "transform", "translate(0,0)" );
	shadow2.setAttribute( "transform", "translate(0,0)" );
}
function Slider()
{
	// setInterval seems to lose timer in SVG, have to reset each time!
	if ( g_movingTile && g_movingTile.Slide() == false )
		setTimeout( "Slider()", 50 );
	else
		g_movingTile = null;
}

function tile_click(evt) 
{
	console.log( evt.target.parentNode );
	var ID = parseInt( evt.target.parentNode.getAttribute( "id" ) );

	var tile = tileArray[ID -1];

	var newX = tile.gridX;
	var newY = tile.gridY;
	
	// determine if free space nect to selected tile
	var bFound = true;

	if ( tile.gridX > 0 &&
		gridArray[tile.gridX - 1][tile.gridY] == 0 )
	{	
		newX--; 
	}
	else if ( tile.gridX < numCols - 1 &&
			gridArray[tile.gridX + 1][tile.gridY] == 0 )
	{
		newX++; 
	}
	else if ( tile.gridY > 0 &&
			gridArray[tile.gridX][tile.gridY - 1] == 0 )
	{
		newY--; 
	}
	else if ( tile.gridY < numRows - 1 &&
			gridArray[tile.gridX][tile.gridY + 1] == 0 )
	{
		newY++; 
	}
	else
	{
		bFound = false
	}

	if ( bFound )
	{
		// disable grid
		gridArray[newX][newY] = -1;	 
		
		tile.StartMove( newX, newY );
		
		// grid will be re-enabled on finish tile move, 
		// and EvaluateWin() called	
	}
}

// test if all numbers are in order in normal reading order, disregard blank space
function EvaluateWin()
{
	var num = 1;
	var bWin = true;

	for ( var y = 0; y < numRows && bWin; y++ )
	{
		for ( var x = 0; x < numCols && bWin; x++ )
		{
			if ( gridArray[x][y] != 0 &&
				gridArray[x][y] != num )
			{	
				bWin = false;
			}
			
			if ( gridArray[x][y] != 0 ) 
				num++
		}
	}
	
	if ( bWin )
	{
		svgDoc.getElementById( "win_message" ).setAttribute( "display", "inline" );
	}
}


function TileObject( elem, tileNum )
{
	this.numID = tileNum;
 
	// current grid position
	this.gridX = -1;
	this.gridY = -1;
 
	// moving towards
	this.destX = -1;
	this.destY = -1;
	
	// will use when translating
	this.distToDest = 0;
	this.slideTimer = 0;

	var textX = tilePos + tileSize / 2; 
	var textY = tilePos + 35; 

	// create new tile element
	var newnode = elem.cloneNode( true );
	newnode.setAttribute ( "id", tileNum );
	newnode.setAttribute( "display", "inline" );

	var textNode = svgDoc.createElement('text');
	textNode.setAttribute( 'x', textX );
	textNode.setAttribute( 'y', textY );
	textNode.setAttribute( 'style','text-anchor:middle; font-size:25; font-family:Comic Sans MS;' );

	var text = svgDoc.createTextNode( tileNum );
	textNode.appendChild( text );
	newnode.appendChild( textNode );

	var  contents = svgDoc.getElementById ( "container" );
	this.m_tileElem = contents.appendChild( newnode );

	TileObject.prototype.setPos = function( x, y )
	{
		this.gridX = x;
		this.gridY = y;

		this.m_tileElem.setAttribute( "transform", "translate(" + (tileSize * x) + ", " + (tileSize * y) + ")" );
	}

	TileObject.prototype.StartMove = function( x, y )
	{
		// prepare info for sliding
		this.destX = x;
		this.destY = y;
		this.distToDest = tileSize;
		
		g_movingTile = this;
			
		setTimeout( "Slider()", 50 );
	}

	// slide the tile towards dest
	TileObject.prototype.Slide = function()
	{
		this.distToDest -= tileSize / 5;
		
		var xDiff = this.destX - this.gridX;
		var yDiff = this.destY - this.gridY;
		
		var xTrans = ( tileSize - this.distToDest ) * xDiff;
		var yTrans = ( tileSize - this.distToDest ) * yDiff;
		
		this.m_tileElem.setAttribute( "transform", "translate(" + (tileSize * this.gridX + xTrans) + ", " + (tileSize * this.gridY + yTrans) + ")" );
		
		if ( this.distToDest <= 0 )
		{
			// update the grid
			gridArray[this.gridX][this.gridY] = 0;	
			gridArray[this.destX][this.destY] = this.numID;
			
			this.gridX = this.destX;	
			this.gridY = this.destY;	

			EvaluateWin();
			
			return true;
		}
		
		return false;
	}
}

