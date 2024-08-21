'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import Newletters from '~/components/partials/commons/Newletters';
import CartContent from '~/components/ecomerce/CartContent';
import { useDispatch, useSelector } from 'react-redux';
import { orderHistory } from '~/redux/features/productSlice';
import Wishlist from '~/components/partials/account/Wishlist';
import { format, parseISO } from 'date-fns';

export default function CartScreen() {
    const dispatch = useDispatch();
    const { getOrder } = useSelector((state) => state.product);
    const { user } = useSelector((state) => state.auth);

    const [index, setIndex] = useState(0);
    const data = getOrder?.results?.data?.data;

    useEffect(() => {
        dispatch(orderHistory());
    }, []);
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'account',
        },
    ];

    const nav = [
        { name: 'My Profile', img: '/static/proficon.png' },
        { name: 'Favorite', img: '/static/favourite.png' },
        { name: 'Cart History', img: '/static/carticon.png' },
        { name: 'Loyalty & Voucher', img: '/static/loyal.png' },
        { name: 'Settings', img: '/static/set.png' },
    ];

    const lp = [
        { voucher: 'ROYAL20OFF', status: 'Valid' },
        { voucher: 'ROYAL20OFF', status: 'Valid' },
        { voucher: 'ROYAL20OFF', status: 'Valid' },
    ];
    const setIndexValue = (id) => {
        setIndex(id);
    };
    const myaccount = (
        <div className="flex w-full space-x-8 ">
            <div className="w-[70%]">
                <p>My Account</p>
                <div className="bg-white px-3 py-6 rounded-2xl">
                    <div className="pb-4">
                        <p className="pb-3">Personal Information </p>
                        <p className="text-black">
                            {user?.first_name + ' ' + user?.last_name}
                        </p>
                        <p className="text-black">{user?.email}</p>
                    </div>
                    <div>
                        <p>Address Details</p>
                    </div>
                </div>
            </div>
            <div className=" w-[30%] mt-4 ">
                <div className="bg-white border-[#F5128F] border-2 px-3 py-6  h-fit rounded-2xl">
                    <p>My Loyalty Point</p>
                    <p className="text-[#F5128F] py-4">46 Points</p>

                    <button className="bg-[#ECECEC] py-3 px-6 rounded-3xl">
                        Redeem Points
                    </button>
                </div>
            </div>
        </div>
    );
    const loyalty = (
        <div>
            <div className="bg-white border-[#F5128F] border-2 px-3 h-[80px] items-center flex justify-between  rounded-2xl">
                <p>
                    My Loyalty Point:{' '}
                    <span className="text-[#F5128F] pl-6">45 Points</span>
                </p>
                <button className="bg-[#ECECEC] py-3 px-6 rounded-3xl">
                    Redeem Points
                </button>
            </div>

            <div className="rounded-2xl mt-5 bg-white ">
                <div
                    className="grid grid-cols-3 bg-[#003057] py-4 px-4 rounded-t-2xl text-white ">
                    <div>Voucher</div>
                    <div>Status</div>
                    <div></div>
                </div>
                {lp.map((det) => (
                    <div className="grid grid-cols-3 px-4 mb-8  ">
                        <div className="font-semibold">{det.voucher}</div>
                        <div>{det.status}</div>
                        <div className='justify-end flex w-full' >
                            <img alt="" src="/static/copy.png" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const carthist = (
        <div className="bg-white rounded-3xl">
            {data?.map((items, index) => (
                <div key={index} className="   md:px-[50px] px-[15px] ">
                    <div className=" md:px-9 px-3 md:space-y-0 space-y-4 py-4 md:flex justify-between border-b-2 border-b-[#EBF6F6] ">
                        <div className="md:flex md:space-y-0 space-y-4">
                            <div>
                                <p className="text-black  font-[500] text-[17px] ">
                                    Order number
                                </p>
                                <p className=" text-[16px] ">
                                    {items?.reference}
                                </p>
                            </div>
                            <div className="md:ml-16">
                                <p className="text-black font-[500] text-[17px] ">
                                    Date
                                </p>
                                {console.log(items?.payment?.date)}
                                {<p className=" text-[16px] ">
                                    {items?.payment?.date}
                                </p> ? (
                                    format(
                                        parseISO(items?.payment?.date),
                                        'MMM d, yyyy'
                                    )
                                ) : (
                                    'N/A'
                                )}
                            </div>
                            <div className="md:ml-16">
                                <p className="text-black font-[500] text-[17px] ">
                                    Total aount
                                </p>
                                <p className="text- text-[16px] ">
                                    N{items?.amount}
                                </p>
                            </div>
                        </div>
                        <div>
                            {/* <button
                                    // onClick={handleTrackOpen}
                                    className=" bg-secondary text-white py-4 px-4 rounded-lg font-semibold text-[16px] ">
                                    Tracking Order
                                </button> */}
                        </div>
                    </div>
                    {items?.items?.map((item, index) => (
                        <div key={index}>
                            <div className="md:flex py-4 md:space-x-3">
                                <img
                                    src={
                                        item?.image_url
                                            ? item?.image_url
                                            : '/static/deliv.png'
                                    }
                                    className="h-24 w-24 object-"
                                    alt=""
                                />
                                <div className="md:flex text-[17px] justify-between w-full font-[500] ">
                                    <div>
                                        <p className="font-[500] text-black">
                                            {item?.product_name}
                                        </p>
                                        <p className="font-[400] py-1">
                                            QTY: {item?.quantity}
                                        </p>
                                    </div>
                                    <p className="text-green-400 mt-3 md:mt-0 text-[14px] font-[500] ">
                                        <p className=" text-black">
                                            N {item?.unit_price}
                                        </p>
                                    </p>
                                </div>
                            </div>
                            {/* <hr className='' /> */}
                        </div>
                    ))}

                    <div className="h-[2px] bg-gray-400 w-full my-[50px]"></div>

                    {/* <hr className='my-10' /> */}
                </div>
            ))}
        </div>
    );

    const wlist = <Wishlist />;
    return (
        <>
            <PageContainer footer={<FooterDefault />} title="Shopping Cart">
                <div className="ps-page--simple">
                    <BreadCrumb breacrumb={breadCrumb} />
                    <div className="ps-section--shopping ps-shopping-cart">
                        <div className="container">
                            <div className="flex space-x-8 w-full ">
                                <div className="bg-white h-fit rouded-lg p-4 w-[20%]">
                                    {nav.map((items, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setIndexValue(index)}
                                            className="mb-8 cursor-pointer ">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <img
                                                        alt=""
                                                        src={items.img}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-black">
                                                        {items.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {index === 0 && (
                                    <div className="w-[90%]">{myaccount}</div>
                                )}

                                {index === 1 && (
                                    <div className="w-[90%]">{wlist}</div>
                                )}

                                {index === 2 && (
                                    <div className="w-[90%]">{carthist}</div>
                                )}

                                {index === 3 && (
                                    <div className="w-[90%]">{loyalty}</div>
                                )}
                                {/* <div className="w-[90%]">{wlist}</div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <Newletters layout="container" />
            </PageContainer>
        </>
    );
}
