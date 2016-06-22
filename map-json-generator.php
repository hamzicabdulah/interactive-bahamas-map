<?
/*
This script reads the contents of mapdata.csv file
and converts it into a json data structure
and saves the result to islands.js file.
*/

error_reporting(E_ALL);

$data = file('mapdata.csv');
unset($data[0]);
//print_r($data);

$islands = [];
foreach( $data as $entry )
{
	list($left,$top,$width,$height,$name) = explode(',',$entry);
	
	$obj = new stdclass;	
	$style = new stdclass;	

	$obj->name = trim($name);

	$style->left = $left.'px';
	$style->top = $top.'px';
	$style->width = $width.'px';
	$style->height = $height.'px';
	
	$obj->style = $style;
	
	$islands[] = $obj;
}

//print_r($islands);

$json = json_encode($islands);

$json_content = "var islands = $json;";

file_put_contents('islands.js', $json_content);

echo '<pre>';
print_r(json_decode($json));
?>
