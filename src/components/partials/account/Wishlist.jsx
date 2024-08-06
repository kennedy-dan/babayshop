import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useEcomerce from '~/hooks/useEcomerce';
import CartProduct from '~/components/elements/products/CartProduct';
import useGetProducts from '~/hooks/useGetProducts';
import { ClipLoader } from 'react-spinners';
import { addtocart } from '~/redux/features/productSlice';

export default function Wishlist() {
    const dispatch = useDispatch()
    const ecomerce = useSelector(({ ecomerce }) => ecomerce);
    const { addItem, removeItem } = useEcomerce();
    const {getfav} = useSelector(state => state.product)

    const wishlistItems = useSelector(({ ecomerce }) => ecomerce.wishlistItems);
    const { loading, getStrapiProducts, products } = useGetProducts();
    const fav = getfav?.results?.data?.data

    function getProducts() {
        if (wishlistItems.length > 0) {
            const query = {
                filters: {
                    id: {
                        $in: wishlistItems.map((item) => item.id),
                    },
                },
            };
            getStrapiProducts(query);
        }
    }

    // useEffect(() => {
    //     getProducts();
    // }, [wishlistItems]);

    const addToCart = (id) => {
        const data = {
            product_id: id,
            quantity: 1,
        };
        dispatch(addtocart(data));
    };




    return (
        <div className="ps-section--shopping ps-whishlist">
            <div className="container">
                <div className="ps-section__header">
                    <h1>Wishlist</h1>
                </div>
                <div className="ps-section__content">     <>
            {getfav?.isLoading && <div className='flex w-screen h-[70vh] items-center justify-center' ><ClipLoader size={20} /></div>  }
           {!getfav?.isLoading &&   <div className="">
                        <div className='grid grid-cols-4 w-full px-3 bg-gray-400 ' >
                            <td></td>
                            <td>Product name</td>
                            <td>Unit Price</td>
                            {/* <td>Vendor</td> */}
                            <td>Action</td>
                        </div>
                    <div className='mt-4' >
                        {fav?.map((product) => (
                            <div className='grid grid-cols-4'  key={product?.product?.id}>
                                <td>
                                    <a
                                        href="#"
                                        onClick={(e) =>
                                            handleRemoveWishlistItem(e, product)
                                        }>
                                        <i className="icon-cross" />
                                    </a>
                                </td>
                                <td>
                                    <CartProduct product={product} />
                                </td>
                                <td className="">${product?.product?.price}</td>
                                {/* <td>ygjhhj</td> */}
                                <td>
                                    <a
                                        className="ps-btn"
                                        // href=""
                                        onClick={() =>
                                            addToCart(product?.product?.id)
                                        }>
                                        Add to cart
                                    </a>
                                </td>
                            </div>
                        ))}
                    </div>
            </div>}
           </></div>
            </div>
        </div>
    );
}
