# Greetings

API For Spliton APP

Here i have created two modules user and trip module

GET METHOD
1) http://localhost:3000/api/users - get all the users

POST METHOD:

2) http://localhost:3000/api/induser - get details of indivual user

{
    "userid":"5bbc92e7fb6fc038040d55de"
}

3) http://localhost:3000/api/addmem - Add member to trip

{
    "userid":"5bbc92e7fb6fc038040d55de",
    "tripid":"5bbc98fbfb6fc038040d5998",
    "isadmin":"0"
}

4)  http://localhost:3000/api/addamount - Add expenditure amount

{
	
	"tripid":"5bbc98fbfb6fc038040d5998",
	"userid":"5bbc9331fb6fc038040d55f4",
	"categoryid":"5bbc954afb6fc038040d571d",
	"amount":5000

}

5)  http://localhost:3000/api/spliton - Split Amount

{	
	"tripid":"5bbc98fbfb6fc038040d5998"
}
