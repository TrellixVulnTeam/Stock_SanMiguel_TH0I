import  {Router, Response ,Request}  from "express";
import {verificarToken} from "../middlewares/authentication";
import connection from "../bin/connectionMySQL";
const productosRoutes = Router(); 


productosRoutes.get('/muestraproductos', verificarToken ,(req: Request, res: Response) => {
    const body = req.body;
    connection.query('select * from productos', (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "productos encontrados",
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

productosRoutes.get('/muestraProv', verificarToken ,(req: Request, res: Response) => {
    const body = req.body;
    connection.query('select * from productos where id_producto = ?',[body.id_producto], (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "producto encontrado",
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

productosRoutes.post('/updateproducto', verificarToken, (req: Request, res: Response) => {
    const body = req.body;
    connection.query('update productos set  nombre = ?, id_tipo = ?, id_proveedor = ?, peso = ?, precio = ?, activo = ? where id_producto = ?', [body.id_producto, body.nombre , body.id_tipo , body.id_proveedor, body.peso, body.precio , body.activo], (error: any, result: any) => {
    
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "producto modificado",
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

productosRoutes.post('/agregarproducto', verificarToken, (req: Request, res: Response) => {
    const body = req.body;
    connection.query('INSERT INTO productos (nombre , id_tipo , id_proveedor , peso , precio , activo) VALUES (?,?,?,?,?,?)', [body.nombre , body.cuil_cuit , body.email, body.localidad, body.telefono , body.activo], (error: any, result: any) => {
        if (error) {
            throw error
        }
        if (result != '') {
            return res.json({
                estado: "success",
                mensaje: "producto modificado",
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

export default productosRoutes;