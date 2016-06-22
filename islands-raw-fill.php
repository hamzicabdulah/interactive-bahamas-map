<?
/*
This script 
reads the contents of islands-raw.js
and converts the json to a php object.
Then reads the contents of mapdata.csv file
and adds the x,y,w,y values to the php object
and then converts that back to json and 
writes it to islands-cooked.js
*/

error_reporting(E_ALL);

$json = file_get_contents('islands-raw.js');
$json = json_decode($json);
//var_dump($json);


$data = file('mapdata.csv');
unset($data[0]);
$data = array_values($data);
//print_r($data);

$islands = [];
foreach( $data as $key => $entry )
{
	list($left,$top,$width,$height,$name) = explode(',',$entry);
	$name = trim($name);
	
	$json[$key]->boundingbox->x = $left;
	$json[$key]->boundingbox->y = $top;
	$json[$key]->boundingbox->w = $width;
	$json[$key]->boundingbox->h = $height;
	$json[$key]->boundingbox->style = $json[$key]->style;
	unset( $json[$key]->style );
}

//print_r($json);

$json = json_encode($json, JSON_PRETTY_PRINT);
$json_content = "var islands = \n$json\n;";
file_put_contents('islands-cooked.js', $json_content);

echo '<pre>';
echo $json_content;
##print_r(json_decode($json));
?>
