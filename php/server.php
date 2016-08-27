<?php


$orders = array();

function getPreviousOrders() {
	return count( $orders );
}

function addOrder( $order ) {
	array_push( $orders, $order );
}

if( $_GET["orders"] ) {
  return getPreviousOrders();
  
  exit();
}

?>