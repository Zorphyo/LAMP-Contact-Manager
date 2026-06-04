<?php

	$inData = getRequestInfo();

	$contactId = $inData["ID"];
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
		$stmt = $conn->prepare(
			"UPDATE Contacts
			 SET FirstName = ?, LastName = ?, Phone = ?, Email = ?
			 WHERE ID = ? AND UserID = ?"
		);

		$stmt->bind_param(
			"ssssii",
			$firstName,
			$lastName,
			$phone,
			$email,
			$contactId,
			$userId
		);

		$stmt->execute();

		if ($stmt->error)
		{
			returnWithError($stmt->error);
		}
		else
		{
			returnWithError("None");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

?>
