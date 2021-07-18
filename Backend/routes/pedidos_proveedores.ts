import  {Router, Response ,Request}  from "express";
import {verificarToken} from "../middlewares/authentication";
import connection from "../bin/connectionMySQL";
import {IfileUpload} from "../interfaces/file_upload";
import FileSystem from "../class/file_systeam";
import bodyParser from "body-parser";
import query from "../class/promesa";

const filesystem = new FileSystem; 

const pedidosprovRoutes = Router(); 

pedidosprovRoutes.post('/muestraPedidosProv', verificarToken ,(req: Request, res: Response) => {
    const body = req.body;
    connection.query('select * from pedidos_proveedores where id_proveedor = ? order by id_pedidos_proveedores desc ',[body.id_proveedor], (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "pedidos proveedores encontrados",
                data: result
            })
        } else {
            return res.json({
                estado: "success",
                mensaje: "Error query"

            })
        }
    })
})
pedidosprovRoutes.get('/muestraPedidos', verificarToken ,(req: Request, res: Response) => {
    
    connection.query('select * from pedidos_proveedores order by id_pedidos_proveedores desc ', (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "pedidos proveedores encontrados",
                data: result
            })
        } else {
            return res.json({
                estado: "success",
                mensaje: "Error query"

            })
        }
    })
})

pedidosprovRoutes.post('/muestraPedidoProv', verificarToken ,(req: Request, res: Response) => {
    const body = req.body;
    connection.query('select * from pedidos_proveedores where id_pedidos_proveedores = ?',[body.id_pedidos_proveedores], (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "pedidos proveedor encontrado",
                data: result
            })
        } else {
            return res.json({
                estado: "success",
                mensaje: "Error query"

            })
        }
    })
})

pedidosprovRoutes.post('/agregarPedidoProv', verificarToken ,async (req: Request, res: Response) => {
   
    try{
        const body = req.body;
    
            await query("start transaction");
    
            const insertPedido:any = await query('INSERT INTO pedidos_proveedores (id_proveedor, id_tipo, importe , fecha, observacion,path_imagen, id_usuario) VALUES (?,?,?,?,?,?,?)', [body.id_proveedor, body.id_tipo, body.importe , body.fecha, body.observacion, body.path_imagen, body.id_usuario]);
            
            const nroPedido:any =  await query('SELECT max(id_pedidos_proveedores) as id FROM pedidos_proveedores');
            
            
            for (let index = 0; index < body.detalles.length; index ++) {
                let detalle:Array<any> = body.detalles[index];
                console.log(detalle);
                await query('INSERT INTO detalles_pedidos_productos (id_pedido , id_tipo , id_producto , cantidad , precio_unitario ) VALUES (?,?,?,?,?)', [nroPedido[0].id, detalle[0] ,detalle[1], detalle[2], detalle[3]]);
            }
    
            await query("commit");

            res.json({estado: "success"}) 
    }
    catch(error){
        const rollback = await query("rollback");
        res.json({estado:"error", data:error, rollabck:rollback});
    }
})

pedidosprovRoutes.post('/modificaPedidoProv', verificarToken ,  (req: Request, res: Response) => {
    
    const body = req.body;
    connection.query('UPDATE pedidos_proveedores set id_proveedor = ?, id_tipo = ?, importe = ?, fecha = ?, observacion = ?,path_imagen = ?, id_usuario = ? where id_pedido = ?', [body.id_proveedor, body.id_tipo, body.importe , body.fecha, body.observacion, body.path_imagen, body.id_usuario, body.id_pedido], (error: any, result: any) => {
    
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "pedido modificado",
                data: result
            })
        } else {
            return res.json({
                estado: "success",
                mensaje: "Error Update"
            })
        }
    })
})



pedidosprovRoutes.post('/upload' ,async (req:any, res:Response )=>{

    const imagen:IfileUpload = req.files.imagen;
    
    if(!req.files){
        res.status(400).json({
            estado:'error',
            mensaje:'No se subio el archivo'
        })
    }

    if(!imagen.mimetype.includes('image')){
        res.status(400).json({
            estado:'error',
            mensaje:'Formato incorrecto'
        })
    }    
    
    await filesystem.guardarImagen('prueba',imagen)
    
    res.json({
        estado: 'success',
        data:imagen
    })
})

export default pedidosprovRoutes;