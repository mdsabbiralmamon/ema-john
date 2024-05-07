import { getShoppingCart } from "../utilities/fakedb";

const cartProductsLoader = async () => {

    // if cart data is in database, you have to use async await
    const storedCart = getShoppingCart();
    const productsIdInCart = Object.keys(storedCart);
    console.log("cart products Id ", productsIdInCart);

    const loadedProducts = await fetch('http://localhost:5000/cart-products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productsIdInCart)
    });

    const products = await loadedProducts.json();

    const savedCart = [];

    for (const id in storedCart) {
        const addedProduct = products.find(pd => pd._id === id);
        if (addedProduct) {
            const quantity = storedCart[id];
            addedProduct.quantity = quantity;
            savedCart.push(addedProduct);
        }
    }

    // if you need to send two things
    // return [products, savedCart]
    // another options
    // return { products, cart: savedCart }

    return savedCart;
}

export default cartProductsLoader;