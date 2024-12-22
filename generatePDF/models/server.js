const express = require('express');
const cors = require("cors");
var path = require('path');
require('dotenv').config();

class Server 
{

    constructor()
    {
        this.PORT = 3000;
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
        this.app.use(this.rutaPage,require('../routes/pdfCalificacion.routes'));
     
        
        
        this.app.set('views', path.join(__dirname, '../', '/public'));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
    
    }

    listen()
    {

        this.app.listen(this.PORT, () => {
        console.log(`Server running on port ${this.PORT}`);
        });

    }

}

module.exports = Server;