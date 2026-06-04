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

	let tmp = {Login:login,Password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contactSearch.html";
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

    window.location.href = "createContact.html";
}

function saveContact()
{
    let originalContact =
        JSON.parse(sessionStorage.getItem("editingContact"));

    let tmp =
    {
        ID: originalContact.ID,
        FirstName: document.getElementById("firstName").value,
        LastName: document.getElementById("lastName").value,
        Phone: document.getElementById("phone").value,
        Email: document.getElementById("email").value,
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

            if(jsonObject.error == "None")
            {
                searchContacts();
            }
            else
            {
                document.getElementById("contactSearchResult").innerHTML =
                    jsonObject.error;
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

	let tmp = {search:srch,userId:userId};
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

				contacts = jsonObject.results;
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
				    let rowClass = (i % 2 == 0) ? "contactColor1" : "contactColor2";
				
				    contactList +=
				        "<div class='contactRow " + rowClass + "'>" +
				        "<strong>" + jsonObject.results[i].FirstName + " " +
				        jsonObject.results[i].LastName + "</strong><br>" +
				        jsonObject.results[i].Phone + "<br>" + 
						jsonObject.results[i].Email +
						"<br><button onclick='editContact(" + i + ")'>Edit</button>" + 
						"<br><button onclick='deleteContact(" + jsonObject.results[i].ID + ")'>Delete</button>" + 
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

    let tmp =
    {
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
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

                if (jsonObject.error != "None")
                {
                    document.getElementById("loginResult").innerHTML =
                        jsonObject.error;
                }
                else
                {
                     window.location.href = "contactSearch.html";
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
