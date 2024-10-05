
const express = require('express');
const cors = require("cors");
var path = require('path');
require('dotenv').config();



class Server 
{

    constructor()
    {
        this.PORT = 8080;
        this.app = express();

    
    
        this.rutaPage = '/'


        this.middlewares();
        this.routes();
    }

    middlewares()
    {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static(path.join(__dirname, '../', "public")));
    }
    
    routes()
    {
       

    
    }

    listen()
    {

        this.app.listen(this.PORT, () => {
        console.log(`Server running on port ${this.PORT}`);
        });

    }

}

module.exports = Server;

