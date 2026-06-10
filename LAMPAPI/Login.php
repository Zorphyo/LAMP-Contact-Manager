<?php

	$inData = getRequestInfo();
	
	$login = $inData["Login"];
	$password = $indData["Password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	

	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}

	else
	{
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Login FROM Users WHERE Login = ? AND Password = ?");
		$stmt->bind_param("ss", $login, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['ID'], $row['FirstName'], $row['LastName'], $row["Login"] );
		}

		else
		{
			http_response_code(401);

			returnWithError("Incorrect Username or Password");
		}

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
	
	function returnWithInfo( $id, $firstName, $lastName, $login)
	{
		$retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","Login":"' . $login . '}';
		sendResultInfoAsJson( $retValue );
	}
	
?>