import Server from './class/server';
import userRoutes from './routes/usuarios';
import connection from './bin/connectionMySQL';
import bodyParser from 'body-parser';
import proveedoresRoutes from './routes/proveedores';
import tiposRoutes from './routes/tipos';
import productosRoutes from './routes/productos';
import pedidosprovRoutes from './routes/pedidos_proveedores';
import pedidosventRoutes from './routes/pedidos_venta';
import fileUpload from 'express-fileupload';

//Creando servidor web
const server = new Server();

server.start(()=>{
    console.log(`Servidor corriendo en puerto ${server.puerto} y en host ${server.host}`);
});

server.app.use(bodyParser.urlencoded({extended:true}))
server.app.use(bodyParser.json())

//upload
server.app.use(fileUpload());

// Rutas de aplicacion
server.app.use('/users', userRoutes);
server.app.use('/prov', proveedoresRoutes);
server.app.use('/tipos', tiposRoutes);
server.app.use('/produ', productosRoutes);
server.app.use('/pedidosprov', pedidosprovRoutes);
server.app.use('/pedidosvent', pedidosventRoutes);




// conexion my sql
connection.connect((error)=>{
    if(error){
        throw error
    }else{
        console.log('Aplicacion conectada a la base de datos de pollos')
    }
})
