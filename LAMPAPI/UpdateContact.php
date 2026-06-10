<?php

	$inData = getRequestInfo();

	$id = $inData["ID"];
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phone = $inData["Phone"];
	$email = $inData["Email"];
	$userId = $inData["UserID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ?");
		$stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $id, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithSuccess("Contact Successfully Updated");
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

	function returnWithSuccess( $success )
	{
		$retValue = '{"Success":"' . $success . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
