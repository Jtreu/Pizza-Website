<?php
error_reporting(0);
// Get a connection for the database
require_once('mysqli_connect.php');

// Create a query for the database
$query = "SELECT order_number, total_price, submit_time, cooked_time, delivery_time, estimated_time FROM orders";

// Get a response from the database by sending the connection
// and the query
$response = @mysqli_query($dbc, $query);

// If the query executed properly proceed
if($response){

echo '<table align="left"
cellspacing="5" cellpadding="8">

<tr><td align="left"><b>Order Number</b></td>
<td align="left"><b>Total Price</b></td>
<td align="left"><b>Submit Time</b></td>
<td align="left"><b>Cooked Time</b></td>
<td align="left"><b>Delivery Time</b></td>
<td align="left"><b>Estimated Time (Minutes)</b></td></tr>';

echo '<p><b><u>IMPORTANT</u>: You need to double click the buttons for updating cook/delivery time.<br/>
      Once to update to the database, and a second time for it to show on this table<br/>
      (I am not quite sure why this is the case)</b></p>';

if(!empty($num_order_cooked_time=$_GET['cookedTime'])) {
	// $query="SELECT * FROM orders WHERE id='$id'";
	$timeQuery="UPDATE `orders` SET `cooked_time` = CURRENT_TIME() WHERE `orders`.`order_number` = '".$num_order_cooked_time."'";

	if ($dbc->query($timeQuery) === TRUE) {
	    echo "Record updated successfully";
	} else {
	    echo "Error updating record: " . $dbc->error;
	}
}

if(!empty($num_order_delivery_time=$_GET['deliveryTime'])) {
	// $query="SELECT * FROM orders WHERE id='$id'";
	$timeQuery="UPDATE `orders` SET `delivery_time` = CURRENT_TIME() WHERE `orders`.`order_number` = '".$num_order_delivery_time."'";

	if ($dbc->query($timeQuery) === TRUE) {
	    echo "Record updated successfully";
	} else {
	    echo "Error updating record: " . $dbc->error;
	}
}

// mysqli_fetch_array will return a row of data from the query
// until no further data is available
while($row = mysqli_fetch_array($response)){

echo '<tr><td align="left">' . 
$row['order_number'] . '</td><td align="left">' . 
$row['total_price'] . '</td><td align="left">' .
$row['submit_time'];

if(is_null($row['cooked_time']) == false) {
	echo '</td><td align="left">' . $row['cooked_time']; 
} else if(is_null($row['cooked_time']) == true) {
	echo '<td><form action="getOrderInfo.php" method="get"><input type="hidden" name="cookedTime" value="'.$row["order_number"].'" style="text-decoration: none" /><input type="submit" value="Ready?" /></form>';
}
if(is_null($row['delivery_time']) == false)  {
	echo '</td><td align="left">' . $row['delivery_time'];
} else if(is_null($row['delivery_time']) == true) {
	echo '<td><form action="getOrderInfo.php" method="get"><input type="hidden" name="deliveryTime" value="'.$row["order_number"].'" style="text-decoration: none" /><input type="submit" value="Delivered?" /></form>';
}

echo '</td><td align="left">' .
$row['estimated_time'] . '</td><td align="left">';

echo '</tr>';
}

echo '</table>';

} else {

echo "Couldn't issue database query<br />";

echo mysqli_error($dbc);

}

// Close connection to the database
mysqli_close($dbc);

?>