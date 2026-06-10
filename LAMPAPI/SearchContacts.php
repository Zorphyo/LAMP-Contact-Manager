<?php

	$inData = getRequestInfo();

	$userId = $inData["UserID"];
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
		$stmt = $conn->prepare("SELECT DISTINCT FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
		$contactName = "%" . $query . "%";
		$stmt->bind_param("ssi", $contactName, $contactName, $userId);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while ($row = mysqli_fetch_row($result))
		{
			$resultArray[] = $row 
		}

		echo json_encode($resultArray);
		
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
		$retValue = '{"results":[' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}
	
?>