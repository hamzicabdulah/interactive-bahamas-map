

function makeSubRegion( sub, parent)
{
	var style = '';
	
	var top  = sub.y - parent.y;
	var left = sub.x - parent.x;
	var backgroundPosition = '-'+sub.x + 'px -'+sub.y+'px';
	
	var subDiv = $('<div>').addClass('map-sub')
			.css('width'  , sub.w)
			.css('height' , sub.h)
			.css('left'   , left )
			.css('top'    , top  )
			.css('backgroundPosition',backgroundPosition);
	return subDiv;
}

function makeManySubRegions(current)
{
	var multidiv = [];
	for(var i=0; i<current.subsections.length; i++)
	{
		var sub = makeSubRegion( current.subsections[i], current.boundingbox );
		multidiv.push( sub );
	}
	return multidiv;
}

function xywhToStyle( obj )
{
	return { width:obj.w, height:obj.h, top:obj.y+"px", left:obj.x+"px" };
}

function tokenizeName( text )
{
	return text.toLowerCase().replace(' ','_');
}

var mapdiv = $('.i-bahamasmap');
var infoSections = $('.i-bahamasmap section');

// Collect island info section elements into an object keyed
// by the island names in a tokenized form.
var infoData = {};

infoSections.each( function(i,e){
	var name = $(e).find('header a').text();
	var nameToken = tokenizeName( name );
	infoData[ nameToken ] = e;
});

//console.log(infoData);

for(var i=0; i<islands.length; i++)
{
	var current = islands[i];
	//console.log( current );
		
	var regionDiv = $('<div>')
		.addClass('map-island')
		.css( xywhToStyle(current.boundingbox) )
		.html( $('<span>').text( current.name ).css('top',current.label.y).css('left',current.label.x) );
	mapdiv.append(regionDiv);
	
	//console.log( current.name +" has "+ current.subsections.length + " sub entries ");
	
	// If the entry has no subsections, use the bounding box data as the subsection.
	if( 0 === current.subsections.length )
	{
		var bb = current.boundingbox;
		current.subsections = [{ x:bb.x, y:bb.y, w:bb.w, h:bb.h }];
	}
	
	
	// add sub-region divs if there are any for the current island
	if( current.subsections.length > 0 && current.subsections[0].h > 1)
	{
		var many = makeManySubRegions( current );
		regionDiv.append( many );
	}
	
	// Build info boxes from section elements in markup.
	// Find appropriate section by matching island name 
	// in js data to text in section header.
	var nameToken = tokenizeName( current.name );

	if( infoData[ nameToken ] )
	{
		regionDiv.append( infoData[ nameToken ] );
	} else { console.warn( 'No Island info section match found for '+current.name ); }
	
}

// Observe sub-regions to apply hover class to their parent bounding box when they are hovered.
$('.map-sub, .map-island span').hover( function(e){
		$(e.target).parent().toggleClass('hovered').css('background','transparent');
		$('.i-bahamasmap').toggleClass('hovermode');
	});

// Observer island regions to go to the url in their info box if anywere within the region is clicked.
$('.map-island').click( function(e){
	e.preventDefault();
	var href = $(e.target).closest('.map-island').find('a').attr('href');
	window.location.href = href;
});