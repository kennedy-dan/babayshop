import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import ModuleEcomerceCartItems from '~/components/ecomerce/modules/ModuleEcomerceCartItems';
import ModuleCartSummary from '~/components/ecomerce/modules/ModuleCartSummary';
import useGetProducts from '~/hooks/useGetProducts';
import { useState } from 'react';
import { IoClose } from "react-icons/io5";

import {
    addtocart,
    getcartData,
    RemoveFromCart,
} from '~/redux/features/productSlice';
import { ClipLoader } from 'react-spinners';
export default function CartContent() {
    const dispatch = useDispatch();
    // const cartItems = useSelector(({ ecomerce }) => ecomerce.cartItems);
    const { getStrapiProducts, products } = useGetProducts();
    const { getcart, addcart, removecart } = useSelector(
        (state) => state.product
    );
    const [cartItems, setCartItems] = useState([]);
    const [quant, setquant] = useState(null);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [removeItemId, setremoveItemId] = useState(null);
    const [prod, setprod] = useState(null);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        if (getcart?.results?.data?.data?.items) {
            setCartItems(getcart.results.data.data.items);
        }
    }, [getcart]);

    const increaseQuant = (itemId) => {
        setUpdatingItemId(itemId.id);
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId.id) {
                    setquant(item.quantity + 1);
                    setprod(itemId?.product?.id);
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );
    };

    const decreaseQuant = (itemId) => {
        setUpdatingItemId(itemId.id);
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId.id && item.quantity > 1) {
                    setquant(item.quantity - 1);
                    setprod(itemId?.product?.id);
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            })
        );
    };

    // setCartItems(prevItems =>
    //   prevItems.map(item =>
    //     item.id === itemId && item.quantity > 1
    //       ? { ...item, quantity: item.quantity - 1 }
    //       : item
    //   )
    // );
    // Dispatch an action to update the Redux store if necessary
    // dispatch(updateCartItemQuantity(itemId, 'decrease'));

    const removeCart = (id) => {
        console.log(id);
        setremoveItemId(id?.id);
        const data = {
            product_id: id?.product?.id,
            // image_url: image,
            // action: "decrement",
        };
        dispatch(RemoveFromCart(data)).then(({ error }) => {
            if (!error) {
                dispatch(getcartData());
            }
        });
    };

    useEffect(() => {
        if (quant && prod) {
            const data = {
                product_id: prod,
                quantity: quant,
            };

            dispatch(addtocart(data)).then(({ error }) => {
                if (!error) {
                    dispatch(getcartData());
                }
                setUpdatingItemId(null); // Reset the updating item ID
            });
        }
    }, [quant, prod]);

    console.log(quant);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price;
        }, 0);
    };

    useEffect(() => {
        setTotal(calculateTotal());
    }, [cartItems]);
    console.log(total);

  


    const cartProducts = useMemo(() => {
        if (cartItems.length === 0) return [];
        return products.map((product) => {
            return {
                id: product.id,
                title: product.attributes.title || 'Untitled Product',
                slug: product.attributes.slug || 'untitled-product',
                thumbnailImage: product.attributes.thumbnail || null,
                price: product.attributes.price || 0,
                sale_price: product.attributes.sale_price || 0,
                quantity:
                    cartItems.find((item) => item.id === product.id)
                        ?.quantity ?? 0,
            };
        });
    }, [products, cartItems]);

    const content = useMemo(() => {
        if (cartItems.length === 0) {
            return (
                <div className="ps-section__content">
                    <div className="alert alert-info">
                        <p className="mb-0">Your cart is currently empty.</p>
                    </div>

                    <div className="ps-section__cart-actions">
                        <Link href={'/shop'} className="ps-btn">
                            Back to Shop
                        </Link>
                    </div>
                </div>
            );
        }
        return (
            <div className=" justify-between py-20 px-10 lg:px-[20px] lg:py-[20px] xl:px-[20px] xl:py-[100px] md:space-x-10">
                <div className="w-full">
                    <div className="grid gap-5 grid-cols-6 font-semibold  px-3 bg-gray-300 mb-5 py-4 " >
                        <div className='col-span-2 ' >
                            <p className='text-black font-bold' >PRODUCT</p>
                        </div>
                        <div>
                            <p className='text-black font-bold'>PRICE</p>
                        </div>{' '}
                        <div>
                            <p className='text-black font-bold'>QUANTITY</p>
                        </div>
                        <div>
                            <p className='text-black font-bold'>TOTAL</p>
                        </div>{' '}
                        <div>
                            <p className='text-black font-bold'>ACTION</p>
                        </div>
                    </div>
                    <div className="">
                    {cartItems?.map((items, index) => (
                        <div key={index} className="w-full grid gap-5 grid-cols-6">
                                <div className="flex col-span-2 space-x-5  ">
                                    <div className="w-1/">
                                        <div>
                                            <img
                                                src={
                                                    items?.product?.image_url
                                                        ? items?.product
                                                              ?.image_url
                                                        : '/static/toy.jpg'
                                                }
                                                alt=""
                                                className="w-[70px] h-[70px]  object-cover"

                                                //   width={500}
                                                //   height={500}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-ful">
                                        <p className=" text-black text-[16px] w-[] ">
                                            {items?.product?.name}
                                        </p>
                                   
                                    </div>
                                </div>
                                <div>
                                {getcart?.isLoading ||
                                        (addcart?.isLoading &&
                                            updatingItemId === items.id) ? (
                                            <ClipLoader
                                                color="black"
                                                size={12}
                                            />
                                        ) : (
                                            <div className="text-black font-semibold text-[24px]  space-x-1 font-urbanist flex items-center ">
                                                <div>
                                                    <img
                                                        src="/static/Naira.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <p className='text-[16px] font-bold text-black' > 
                                                    {Math.floor(items?.price)}
                                                </p>
                                            </div>
                                        )}
                                </div>
                                <div className="">
                                    <div className="flex  items-center">
                                        <button
                                            onClick={() =>
                                                decreaseQuant(items)
                                            }>
                                            <img
                                                src={'/static/sub.png'}
                                                alt="Decrease"
                                            />
                                        </button>
                                        <p className="text-black font-bold px-2 text-[13px]">
                                            {items.quantity}
                                        </p>
                                        <button
                                            onClick={() =>
                                                increaseQuant(items)
                                            }>
                                            <img
                                                src={'/static/add.png'}
                                                alt="Increase"
                                            />
                                        </button>
                                    </div>

                            
                                </div>

                                <div>
                                {getcart?.isLoading ||
                                        (addcart?.isLoading &&
                                            updatingItemId === items.id) ? (
                                            <ClipLoader
                                                color="black"
                                                size={12}
                                            />
                                        ) : (
                                            <div className="text-black font-semibold text-[24px]  space-x-1 font-urbanist flex items-center ">
                                                <div>
                                                    <img
                                                        src="/static/Naira.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <p className='text-[17px] font-bold text-black' >
                                                    {Math.floor(items?.price)}
                                                </p>
                                            </div>
                                        )}
                                </div>
                                <div
                                        className="flex  cursor-pointer "
                                        onClick={() => removeCart(items)}>
                                       
                                        {removecart?.isLoading &&
                                        removeItemId === items?.id ? (
                                            <ClipLoader
                                                color="black"
                                                size={12}
                                            />
                                        ) : (
                                            <div><IoClose size={22} /></div>
                                        )}
                                    </div>

                            {/* <br /> */}
                            <hr className="my-5" />
                        </div>
                    ))}
                    </div>

                  
                </div>
                {/* <div className="mt-10">
                            <Link href="/account/checkout">
                                <button className="w-full text-white bg-yellow-600 py-4 rounded-lg font-semibold text-[16px] ">
                                  
                                </button>
                            </Link>
                        </div> */}
                <div className='flex justify-end ' >
                    <div>
   <div className=" md:w-[370px] bg-gray-300 mt-4 md:mt-0 rounded-xl p-[20px] border-2  font-montserrat ">
                        {/* <p className="font-bold text-[32px]">Summary</p> */}
                      
                        <div className="flex justify-between font-[500] mt-7">
                            <p className="text-[16px] text-black">Subtotal</p>
                            <p className="text-[16px] text-black">
                                N {total && total?.toFixed(2)}
                            </p>
                        </div>

                        <hr className='mt-7' />

                        <div className="flex justify-between font-[500] py-6">
                            {/* <p className="text-[16px]">Tax</p>
                  <p className="text-[16px]">N 4000</p> */}
                        </div>

                   {cartItems?.map(items => <div className='' >
                      <p className=" text-black text-[16px] w-[] ">
                                            {items?.product?.name}
                                        </p>

                                        <div className='mt-1' >
                                             <p className="text-black  px-2 text-[13px]">
                                            X{items.quantity}
                                        </p>
                                        </div>
                                        <hr className='my-9' />
                   </div>)}
                       <div className="flex justify-between font-bold  mt-7">
                            <p className="text-[20px] text-red-700 font-bold">Total</p>
                            <p className="text-[20px] text-red-700 font-bold ">
                                N {total && total?.toFixed(2)}
                            </p>
                        </div>
                      
                    </div>
                          <div className="mt-10">
                            <Link href="/account/checkout">
                                <button className="w-full text-white bg-yellow-600 py-4 rounded-lg font-semibold text-[16px] ">
                                  Proceed To  Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                 
                </div>
            </div>
        );
    }, [products, cartItems]);

    return <section>{content}</section>;
}
