<?php

	$inData = getRequestInfo();

	$userId = $inData["UserId"];
	$query = $inData["Query"];
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
		$contactName = "%" . $query . "%";
		$stmt->bind_param("ssi", $contactName, $contactName, $userId);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		 while($row = $result->fetch_assoc())
		 {
		 	if( $searchCount > 0 )
		 	{
		 		$searchResults .= ",";
		 	}

		 	$searchCount++;
		 	$results = array();

		 	while($row = $result->fetch_assoc())
		 	{
		 	    $results[] = $row;
			}
		}

		/*$results = array();

		while($row = $result->fetch_assoc())
		{
		    $results[] = $row;
		}
		
		$searchCount = count($results);
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}

		else
		{
			//returnWithInfo( $searchResults );
			echo json_encode(array(
			    "results" => $results,
			    "error" => ""
			));
		}*/

		returnWithInfo( $results );
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"Error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"Results":[' . $searchResults . '],"Error":"None"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
