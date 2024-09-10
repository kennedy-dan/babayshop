import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import OnCartProduct from '~/components/elements/products/OnCartProduct';
import useEcomerce from '~/hooks/useEcomerce';
import { calculateAmount } from '~/utilities/ecomerce-helpers';
import useGetProducts from '~/hooks/useGetProducts';
import { useDispatch, useSelector } from 'react-redux';

const MiniCart = () => {
    const { removeItem } = useEcomerce();
    const dispatch= useDispatch()
    const { singlecats, singleproducts, addcart, getcart } = useSelector((state) => state.product);
    // const cartItems = useSelector(({ ecomerce }) => ecomerce.cartItems);
    const { getStrapiProducts, products } = useGetProducts();

    const cart = getcart?.results?.data?.data?.items

    function handleRemoveItem(e, productId) {
        e.preventDefault();
        // removeItem({ id: productId }, cartItems, 'cart');
    }

    function getCartProducts() {
        // if (cartItems.length > 0) {
        //     const query = {
        //         filters: {
        //             id: {
        //                 // $in: cartItems.map((item) => item.id),
        //             },
        //         },
        //     };
        //     getStrapiProducts(query);
        // }
    }

    useEffect(() => {
        getCartProducts();
    }, []);

    const cartProducts = useMemo(() => {
        // if (cartItems.length === 0) return [];
        // return products.map((product) => {
        //     return {
        //         id: product.id,
        //         title: product.attributes.title || 'Untitled Product',
        //         slug: product.attributes.slug || 'untitled-product',
        //         thumbnailImage: product.attributes.thumbnail || null,
        //         price: product.attributes.price || 0,
        //         sale_price: product.attributes.sale_price || 0,
        //         quantity:
        //             cartItems.find((item) => item.id === product.id)
        //                 ?.quantity ?? 0,
        //     };
        // });
    }, []);

    const cartAmount = useMemo(() => {
        // return calculateAmount(cartProducts);
    }, []);

    const cartItemsContent = useMemo(() => {
        // if (cartProducts.length === 0) {
        //     return (
        //         <div className="ps-cart__content">
        //             <div className="ps-cart__items">
        //                 <span>No products in cart</span>
        //             </div>
        //         </div>
        //     );
        // }

        return (
            <div className="ps-cart__content">
                <div className="ps-cart__items">
                    {/* {cartProducts.map((item) => {
                        return (
                            <OnCartProduct product={item} key={item.id}>
                                <a
                                    className="ps-product__remove"
                                    onClick={(e) =>
                                        handleRemoveItem(e, item.id)
                                    }>
                                    <i className="icon-cross" />
                                </a>
                            </OnCartProduct>
                        );
                    })} */}
                </div>
                <div className="ps-cart__footer">
                    <h3>
                        Sub Total:
                        <strong>${cartAmount}</strong>
                    </h3>
                    <figure>
                        <Link
                            href={'/account/shopping-cart'}
                            className="ps-btn">
                            View Cart
                        </Link>
                        <Link href={'/account/checkout'} className="ps-btn">
                            Checkout
                        </Link>
                    </figure>
                </div>
            </div>
        );
    }, []);

    return (
        <>
              <div className="block relative">

            <Link className="" href="/account/shopping-cart">
                {/* <i className="icon-bag2" /> */}
                <img src='/static/cart.png' alt='' className='md:w-fit  w-8' />
                <div className=' w-7 h-7 md:w-9 md:h-9 absolute md:text-base text-[12px] flex justify-center items-center left-4 md:left-7 md:top-7 text-white text-center   bg-[#F5128F] rounded-full' >
                <div>{cart?.length}</div>
                </div>
            </Link>
            </div>
            {/* {cartItemsContent} */}
        </>
    );
};

export default MiniCart;
