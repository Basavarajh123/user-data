

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors=require('cors');
const path = require("path");

const databasePath = path.join(__dirname, "login.db");

const app = express();

app.use(cors());
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
    try {
      database = await open({
        filename: databasePath,
        driver: sqlite3.Database,
      });
  
      app.listen(3008, () =>
        console.log("Server Running at http://localhost:3008/")
      );
    } catch (error) {
      console.log(`DB Error: ${error.message}`);
      process.exit(1);
    }
  };
  

  initializeDbAndServer();

  app.get("/users",async(request,response)=>{

  

    const query=`SELECT * FROM User `
    const data = await database.all(query)
    response.send(data);
    
    
  })

  app.post('/users/signup',async(request,response)=>{
    const {name,email,password}= request.body;

    const query =`INSERT INTO User(username,email,password)
              VALUES('${name}','${email}','${password}');
    `;
    await database.run(query);
    response.send('User Added Successfully');
  })

  app.post('/users/login',async(request,response)=>{
    const {email,password}=request.body;
    const sql =`SELECT * FROM User WHERE email="${email}" AND password ="${password}"`;
    await database.get(sql);
    response.send('Login Successfully');

  })
 

  module.exports=app;