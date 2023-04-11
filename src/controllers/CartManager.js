import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'
import ProductManager from './ProductManager.js'

const allProducts = new ProductManager

class CartManager {
    constructor() {
        this.path = './src/models/cart.json'
    }

    readCart = async () => {
        let cart = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(cart)
    }

    exists = async (id) => {
        let productInCart = await this.readCart()
        return productInCart.find(prod => prod.id === id)
    }

    writeCart = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart))
    }

    addCart = async () => {
        let prevCart = await this.readCart()
        let id = nanoid()
        let currentcart = [{id: id, products: []}, ...prevCart] //lo que quiero agregar al cart, más el cart inicial
        await this.writeCart(currentcart)

        return 'Agregado al carrito'
    }

    getCartById = async (id) => {
        let cartById = await this.exists(id)

        if (!cartById) return 'No se encontró el carrito'
        return cartById
    }

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exists(cartId)
        if (!cartById) return 'No se encontró el carrito'
        let productById = await allProducts.productExists(productId)
        if (!productById) return 'No se encontró el producto'

        let allCarts = await this.readCart()
        let filteredCart = allCarts.filter(cart => cart.id != cartId)

        if (cartById.products.some((prod) => prod.id === productId)) { // si hay uno o más productos así en el carrito
            let productInCart = cartById.products.find(prod => prod.id === productId)
            productInCart.cantidad + 1
            let updatedCart = [productInCart, ...filteredCart]
            await this.writeCart(updatedCart)

            return 'Producto sumado al carrito'
        } else { // si no hay un producto así en el carrito
            cartById.products.push({id: productById.id, cantidad: 1})
            let updatedCart = [productInCart, ...filteredCart]
            await this.writeCart(updatedCart)
            
            return 'Producto agregado al carrito'
        }
    }
}

export default CartManager