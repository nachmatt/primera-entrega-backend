import {promises as fs} from 'fs'
import { nanoid } from 'nanoid'

class ProductManager {
    constructor() {
        this.path = './src/models/products.json'
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(products)
    }

    productExists = async (id) => {
        let products = await this.readProducts()
        return products.find(prod => prod.id === id)
    }
    
    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    getProducts = async () => {
        return await this.readProducts()
    }

    getProductsById = async (id) => {
        let productById = await this.productExists(id)

        if (!productById) return 'No se encontró el producto'
        return productById
    }

    addProduct = async (product) => {
        let prevProducts = await this.readProducts()
        product.id = nanoid()
        let updatedProducts = [...prevProducts, product]
        await this.writeProducts(updatedProducts)

        return 'Producto Agregado'
    }

    updateProducts = async (id, product) => {
        let productById = await this.productExists(id) //chequea si existe el producto
        if(!productById) {
            return 'No se encontró el producto'
        } else {
            await this.deleteProduct(id) //lo borra
            let productsToUpdate = await this.readProducts() //traigo los productos existentes
            let products = [{...product, id: id}, ...productsToUpdate] //le agrego a los existentes el producto actualizado sin modificar el id
            await this.writeProducts(products) //sobreescribo el json

            return 'Producto Actualizado'
        }
        
    }

    deleteProduct = async (id) => {
        let products = await this.readProducts()
        let productToDelete = products.some(prod => prod.id === id)

        if (productToDelete) {
            let filteredProducts = products.filter(prod => prod.id !== id)
            await this.writeProducts(filteredProducts)
            return 'Producto Eliminado'
        } else {
            return 'El producto a eliminar no existe'
        } 
    }
}

export default ProductManager