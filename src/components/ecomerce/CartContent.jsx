import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import ModuleEcomerceCartItems from '~/components/ecomerce/modules/ModuleEcomerceCartItems';
import ModuleCartSummary from '~/components/ecomerce/modules/ModuleCartSummary';
import useGetProducts from '~/hooks/useGetProducts';
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

import {
    addtocart,
    getcartData,
    RemoveFromCart,
    valCoupons,
} from '~/redux/features/productSlice';
import { ClipLoader } from 'react-spinners';
export default function CartContent() {
    const dispatch = useDispatch();
    const { getcart, addcart, removecart , valcoupons} = useSelector(
        (state) => state.product
    );

    const [cartItems, setCartItems] = useState([]);
    const [quant, setquant] = useState(null);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [removeItemId, setremoveItemId] = useState(null);
    const [coupon, setCoupon] = useState('')
    const [prod, setprod] = useState(null);
    const [total, setTotal] = useState(0);
    const [sizeId, setSizeId] = useState(null);
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
                    setSizeId(itemId?.selected_size?.id)

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
                    setSizeId(itemId?.selected_size?.id)
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
                size_id: sizeId

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

    const validate = async () => {
      const responseData = await  dispatch(valCoupons(coupon))
      
    const response = unwrapResult(responseData);

    console.log(response)
    if (response?.data?.code === 200) {
        console.log('yeahh')
        localStorage.setItem('coupon', coupon)
    }

    }

    useEffect(() => {
        setTotal(calculateTotal());
    }, [cartItems]);

    return (
        <div className=" justify-between py-16 px-6 lg:px-[20px] lg:py-[20px] xl:px-[20px] xl:py-[40px] md:space-x-10">
            <div className="w-full md:flex md:justify-between md:space-x-12 ">
                <div className="md:w-[60%]">
                    <div className="grid gap-5 grid-cols-5 font-semibold  px-3 bg-[#003057] mb-5 py-4 ">
                        <div className="col-span-2 ">
                            <p className="text-white font-bold">PRODUCT</p>
                        </div>
                        <div>
                            <p className="text-white font-bold">PRICE</p>
                        </div>{' '}
                        <div className="flex ">
                            <p className="text-white font-bold">QUANTITY</p>
                        </div>
                        <div className="flex justify-end">
                            <p className="text-white font-bold">SIZE</p>
                        </div>
                    </div>
                    <div className="">
                        {cartItems?.map((items, index) => (
                            <div
                                key={index}
                                className="w-full grid gap-5 mb-5 grid-cols-5">
                                <div className="flex col-span-2 space-  ">
                                    <div className="flex space-x-3  ">
                                        <div className="md:bg-white  rounded-2xl">
                                            <Image
                                                src={
                                                    items?.product?.image_url
                                                        ? items?.product
                                                              ?.image_url
                                                        : '/static/toy.jpg'
                                                }
                                                alt=""
                                                height={500}
                                                width={500}
                                                className="md:w-[70px] md:h-[70px] h-[26px] w-[26px]  object-cover"

                                                //   width={500}
                                                //   height={500}
                                            />
                                        </div>
                                        <div>
                                            <p className=" text-black md:text-[16px] text-[12px] w-[] ">
                                                {items?.product?.name}
                                            </p>
                                            <div
                                                onClick={() =>
                                                    removeCart(items)
                                                }
                                                className="flex cursor-pointer space-x-4 mt-16 items-center">
                                                <div>
                                                    <img
                                                        src="/static/remove.png"
                                                        alt=""
                                                    />
                                                </div>
                                                <div className=" text-black md:text-[16px] text-[12px] w-[] ">Remove</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="w-ful">
                                        <p className=" text-black text-[16px] w-[] ">
                                            {items?.product?.name}
                                        </p>
                                   
                                    </div> */}
                                </div>
                                <div className='flex justify-start items-start ' >
                                    {getcart?.isLoading ||
                                    (addcart?.isLoading &&
                                        updatingItemId === items.id) ? (
                                        <ClipLoader color="black" size={12} />
                                    ) : (
                                        <div className="text-black font-[500]  flex justify-center items-center">
                                        <div>
                                            <img
                                                src="/static/Naira.png"
                                                alt=""
                                                className="mr-2"
                                            />
                                        </div>

                                        <>{Math.floor(items?.price)}</>
                                    </div>
                                    )}
                                </div>
                                <div className="flex  items-start">
                                    <div className="w-full ">
                                        <button className="flex md:w-[50%] w-[100%] border-2 rounded-md  px-2 py-2 justify-between border-gray-400 items-center">
                                            <button
                                                onClick={() =>
                                                    decreaseQuant(items)
                                                }>
                                                <img
                                                    src={'/static/dec.png'}
                                                    alt=""
                                                />
                                            </button>
                                            <div className="text-black font-[400] px-2 text-[13px]">
                                                {items?.quantity}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    increaseQuant(items)
                                                }>
                                                <img
                                                    src={'/static/inc.png'}
                                                    alt=""
                                                />
                                            </button>
                                        </button>
                                    </div>
                                </div>

                                <div className='flex justify-end' > 
                                <p className=" text-black md:text-[16px] text-[12px] w-[] ">
                                                {items?.selected_size?.size_name}
                                            </p>
                                </div>

                                {/* <br /> */}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:flex md:justify-end   ">
                    <div>
                        <p className="text-[20px] text-black font-[500] ">
                            Cart Summary
                        </p>

                        <div className=" md:w-[370px] bg-white  mt-8  p-[20px]   font-montserrat ">
                            {/* <p className="font-bold text-[32px]">Summary</p> */}

                            <div className="flex justify-between  mt-3">
                                <p className="text-[16px] font-[400] text-black">
                                    Subtotal
                                </p>
                                <p className="text-[16px] text-black">
                                    N {total && total?.toFixed(2)}
                                </p>
                            </div>

                            <hr className="" />

                            <div className="my-4">
                                {cartItems?.map((items) => (
                                    <div className="flex justify-between">
                                        <p className=" text-black font-[300] text-[14px] w-[] ">
                                            {items?.product?.name}
                                        </p>

                                        <div className="mt-1">
                                            <p className="text-black font-[300]  px-2 text-[14px]">
                                                X{items.quantity}
                                            </p>
                                        </div>
                                        {/* <hr className="my-9" /> */}
                                    </div>
                                ))}
                            </div>
                            <hr />

                            <div className="mt-10">
                                <div className="flex justify-between font-bold  mt-7">
                                    <p className="text-[20px] text-black font-[500]">
                                        Total
                                    </p>
                                    {getcart?.isLoading && (
                                        <ClipLoader size={12} color="black" />
                                    )}
                                    {!getcart?.isLoading && (
                                        <p className="text-[20px] text-black font-[500] ">
                                            N {total && total?.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Link className="" href="/account/checkout">
                            <button className="w-full text-white bg-[#F5128F] mt-5 py-4 rounded-lg font-semibold text-[16px] ">
                                Check Out
                            </button>
                        </Link>
                        <div className="mt-10 ">
                            <p className='font-[500] mb-2' >Coupon / Voucher discount</p>
                            <input
                                className="w-full bg-[#FAFAFA] border border-1 px-3 py-2  "
                                placeholder="Enter Coupon Here"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                            />

                            <div className="flex justify-end  mt-3 ">
                                {valcoupons?.success &&  <button onClick={validate} className=" bg-white py-3 px-6 rounded-3xl font-[500] text-[#F5128F] ">
                                    Apply
                                </button> }
                                {!valcoupons?.success &&  <button onClick={validate} className=" bg-white py-3 px-6 rounded-3xl font-[500] text-[#F5128F] ">
                                    Validate
                                </button> }
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    // }, [products, cartItems]);

    return <section>{content}</section>;
}
