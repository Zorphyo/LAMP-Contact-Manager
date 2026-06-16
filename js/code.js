const urlBase = 'http://zorphyo.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let contactId = 0;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	if (login === "" || password === "")
	{
	    document.getElementById("loginResult").innerHTML =
            "Please fill in all fields";
	    return;
	}
	let tmp = {Login:login,Password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// xhr.onreadystatechange = function() 
		// {
		// 	if (this.readyState == 4 && this.status == 200) 
		// 	{
		// 		let jsonObject = JSON.parse( xhr.responseText );
		// 		userId = jsonObject.id;
		
		// 		if( userId < 1 )
		// 		{		
		// 			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
		// 			return;
		// 		}
		
		// 		firstName = jsonObject.firstName;
		// 		lastName = jsonObject.lastName;

		// 		saveCookie();
	
		// 		window.location.href = "contactSearch.html";
		// 	}
		// };
		// xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
		    if (this.readyState == 4)
		    {
		        if (this.status == 200)
		        {
		            let jsonObject = JSON.parse(xhr.responseText);
		
		            userId = jsonObject.id;
		
		            if (!userId || userId < 1)
		            {
		                document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
		                return;
		            }
		
		            firstName = jsonObject.firstName;
		            lastName = jsonObject.lastName;
		
		            saveCookie();
		
		            window.location.href = "contactSearch.html";
		        }
		        else
		        {
		            document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
		        }
		    }
		};
		
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doCreateUser()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword =
        document.getElementById("confirmPassword").value;

    document.getElementById("signupResult").innerHTML = "";

	if (
        firstName === "" ||
        lastName === "" ||
        username === "" ||
        password === "" ||
        confirmPassword === ""
    )
    {
        document.getElementById("signupResult").innerHTML =
            "Please fill in all fields";
        return;
    }
	
    if(password !== confirmPassword)
    {
        document.getElementById("signupResult").innerHTML =
            "Passwords do not match";
        return;
    }

    let tmp =
    {
        FirstName: firstName,
        LastName: lastName,
        Login: username,
        Password: password
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddUser.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader(
        "Content-type",
        "application/json; charset=UTF-8"
    );

    xhr.onreadystatechange = function()
	{
	    if(this.readyState == 4)
	    {
	        try
	        {
	            let jsonObject = JSON.parse(xhr.responseText);
	
	            if(jsonObject.Success)
	            {
	                window.location.href = "index.html";
	            }
	            else if(jsonObject.Error)
	            {
	                document.getElementById("signupResult").innerHTML =
	                    jsonObject.Error;
	            }
	        }
	        catch(err)
	        {
	            document.getElementById("signupResult").innerHTML =
	                "Unexpected server response.";
	        }
	    }
	};

    xhr.send(jsonPayload);
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doSignup()
{
	window.location.href = "signup.html";
}

function doCreateContact()
{
    sessionStorage.removeItem("editingContact");
    window.location.href = "createContact.html";
}

function doContactSearch()
{
	window.location.href = "contactSearch.html";
}

let contacts = [];

function editContact(index)
{
    sessionStorage.setItem(
        "editingContact",
        JSON.stringify(contacts[index])
    );

    sessionStorage.setItem(
        "lastSearch",
        document.getElementById("searchText").value
    );

    window.location.href = "createContact.html";
}

function saveContact()
{
    let originalContact =
        JSON.parse(sessionStorage.getItem("editingContact"));
	
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let phone = document.getElementById("phone").value;
	let email = document.getElementById("email").value;

	document.getElementById("loginResult").innerHTML = "";

	if (
		firstName === "" ||
		lastName === "" ||
		phone === "" ||
		email === ""
	)
	{
		document.getElementById("loginResult").innerHTML =
			"Please fill in all fields";
		return;
	}


	let phoneDigits = phone.replace(/\D/g, "");
	
	if (phoneDigits.length !== 10)
	{
		document.getElementById("loginResult").innerHTML =
			"Phone number must contain 10 digits";
		return;
	}
	
	// Format as xxx-xxx-xxxx
	let formattedPhone =
		phoneDigits.substring(0, 3) + "-" +
		phoneDigits.substring(3, 6) + "-" +
		phoneDigits.substring(6, 10);


	
    let tmp =
    {
        ID: originalContact.ID,
        FirstName: firstName,
        LastName: lastName,
        Phone: formattedPhone,
        Email: email,
        UserID: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            sessionStorage.removeItem("editingContact");
            window.location.href = "contactSearch.html";
        }
    };

    xhr.send(jsonPayload);
}

function deleteContact(contactId)
{
    if(!confirm("Are you sure?"))
    {
        return;
    }

    let tmp =
    {
        ID: contactId,
        UserID: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            let jsonObject = JSON.parse(xhr.responseText);

            if(jsonObject.Success)
			{
			    searchContacts();
			}
			else if(jsonObject.Error)
			{
			    document.getElementById("contactSearchResult").innerHTML =
			        jsonObject.Error;
			}
        }
    };

    xhr.send(jsonPayload);
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp =
	{
		UserID: userId,
		Query: srch
	};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.error == "No Records Found")
				{
				    document.getElementById("contactList").innerHTML = "";
				    document.getElementById("contactSearchResult").innerHTML =
				        "No contacts found.";
				
				    contacts = [];
				    return;
				}
				contacts = jsonObject;
				
				for( let i=0; i<jsonObject.length; i++ )
				{
				    let rowClass = (i % 2 == 0) ? "contactColor1" : "contactColor2";


					contactList +=
					    "<div class='contactRow " + rowClass + "'>" +
					
					        "<div class='contact-info'>" +
					            "<div class='contact-name'>" +
					                jsonObject[i].FirstName + " " +
					                jsonObject[i].LastName +
					            "</div>" +
					
					            "<div class='contact-detail'>" +
					                jsonObject[i].Phone +
					            "</div>" +
					
					            "<div class='contact-detail'>" +
					                jsonObject[i].Email +
					            "</div>" +
					        "</div>" +
					
					        "<div class='contact-actions'>" +
					            "<button class='btn-edit' onclick='editContact(" + i + ")'>Edit</button>" +
					
					            "<button class='btn-delete' onclick='deleteContact(" +
					                jsonObject[i].ID +
					            ")'>Delete</button>" +
					        "</div>" +
					
					    "</div>";
				}
				
				document.getElementById("contactList").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function createContact()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    document.getElementById("loginResult").innerHTML = "";

	if (
        firstName === "" ||
        lastName === "" ||
        phone === "" ||
        email === ""
    )
    {
        document.getElementById("loginResult").innerHTML =
            "Please fill in all fields";
        return;
    }


	let phoneDigits = phone.replace(/\D/g, "");
	
	if (phoneDigits.length !== 10)
	{
	    document.getElementById("loginResult").innerHTML =
	        "Phone number must contain 10 digits";
	    return;
	}
	
	// Format as xxx-xxx-xxxx
	let formattedPhone =
	    phoneDigits.substring(0, 3) + "-" +
	    phoneDigits.substring(3, 6) + "-" +
	    phoneDigits.substring(6, 10);


	
    let tmp =
    {
        FirstName: firstName,
        LastName: lastName,
        Phone: formattedPhone,
        Email: email,
        UserID: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if(jsonObject.Success)
				{
				    window.location.href = "contactSearch.html";
				}
				else if(jsonObject.Error)
				{
				    document.getElementById("loginResult").innerHTML =
				        jsonObject.Error;
				}
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}
