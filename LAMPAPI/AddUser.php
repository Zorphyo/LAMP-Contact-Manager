<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
    $username = $inData["Login"];
    $password = $inData["Password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 

	else
	{
		$check = $conn->prepare("SELECT Login FROM Users WHERE Login = ?");
		$check->bind_param("s", $username);
		$check->execute();
		$check->store_result();

		if ($check->num_rows > 0)
		{
			http_response_code(409);

			returnWithError("Username Is Already In Use");
		}

		else
		{
			$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);
			$stmt->execute();
			$stmt->close();
			returnWithSuccess("User Registered Successfully");
		}

		$check->close();
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

	function returnWithSuccess( $success )
	{
		$retValue = '{"Success":"' . $success . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>