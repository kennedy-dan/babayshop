'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '~/components/elements/BreadCrumb';
import PageContainer from '~/components/layouts/PageContainer';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import Newletters from '~/components/partials/commons/Newletters';
import CartContent from '~/components/ecomerce/CartContent';
import { useDispatch, useSelector } from 'react-redux';
import {
    orderHistory,
    redeemPoint,
    getredeemPoint,
} from '~/redux/features/productSlice';
import Wishlist from '~/components/partials/account/Wishlist';
import { format, parseISO } from 'date-fns';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { IoReturnDownBack } from 'react-icons/io5';
import { getUsers } from '~/redux/features/authSlice';

export default function CartScreen() {
    const dispatch = useDispatch();
    const { getOrder, getredeem } = useSelector((state) => state.product);
    const { user, users } = useSelector((state) => state.auth);

    const [openModal, setOpenModal] = useState(false);
    const [value, setValue] = useState(null);

    const [index, setIndex] = useState(0);
    const data = getOrder?.results?.data?.data;

    useEffect(() => {
        dispatch(orderHistory());
        dispatch(getUsers());
        dispatch(getredeemPoint());
    }, []);

    const redeemed = getredeem?.results?.data?.data;

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'account',
        },
    ];

    const submitpoint = () => {
        if (users?.result?.data?.loyalty_points < 50) {
            toast.error('Loyalty point must be up to 50');
            return;
        }
        const data = {
            points: value,
        };

        dispatch(redeemPoint(data)).then(({}) => {
            dispatch(getredeemPoint());
        });
    };
    const nav = [
        { name: 'My Profile', img: '/static/proficon.png' },
        { name: 'Favorite', img: '/static/favourite.png' },
        { name: 'Order History', img: '/static/carticon.png' },
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
    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                // You can add a notification here to inform the user that the text has been copied
                toast.success('Copied');
                // alert('Copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };
    const myaccount = (
        <div className="md:flex w-full md:space-x-8 ">
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
            <div className=" md:w-[30%] mt-4 ">
                <div className="bg-white border-[#F5128F] border-2 px-3 py-6  h-fit rounded-2xl">
                    <p>My Loyalty Point</p>
                    <p className="text-[#F5128F] py-4">
                        {users?.result?.data?.loyalty_points} Points
                    </p>

                    <button
                        onClick={handleModalOpen}
                        className="bg-[#ECECEC] py-3 px-6 rounded-3xl">
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
                    <span className="text-[#F5128F] pl-6">
                        {users?.result?.data.loyalty_points} Points
                    </span>
                </p>
                <button
                    onClick={handleModalOpen}
                    className="bg-[#ECECEC] py-3 px-6 rounded-3xl">
                    Redeem Points
                </button>
            </div>

            <div className="rounded-2xl md:text-base text-[12px] mt-5 bg-white ">
                <div className="grid grid-cols-3 bg-[#003057] py-4 px-4 rounded-t-2xl text-white ">
                    <div>Voucher</div>
                    <div>Status</div>
                    <div></div>
                </div>
                {redeemed?.map((det) => (
                    <div className="grid grid-cols-3 px-4 py-4 mb-8  ">
                        <div className="font-semibold">{det.code}</div>
                        <div>{det.status}</div>
                        <div className="justify-end flex w-full">
                            {/* <img alt="" src="/static/copy.png" /> */}
                            <div
                                onClick={() => copyToClipboard(det.code)}
                                className="cursor-pointer">
                                <img alt="" src="/static/copy.png" />

                                {/* <Copy size={20} /> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const carthist = (
        <div className="bg-white  rounded-3xl">
            {data?.length < 1 && <p>No Order History</p>}
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
                                <p>
                                    {items?.payment?.date
                                        ? format(
                                              parseISO(items?.payment?.date),
                                              'MMM d, yyyy'
                                          )
                                        : 'N/A'}
                                </p>
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

    const account = (
        <div>
            <div className="md:flex">
                <div className='md:w-1/2' >
                    <p>Personal Information</p>
                    <p className='text-[11px]'>Please provide your personal information</p>
                </div>
                <div className='md:w-1/2 md:mt-0 mt-8'>
                    <p>Name</p>
                    <input value={user?.first_name + ' ' + user?.last_name} className="border w-[80%] border-1 px-4 py-3 border-gray-500" />

                    <div className='mt-5' >
                        {' '}
                        <p>Email</p>
                        <input value={user?.email} className="border w-[80%] border-1 px-4 py-3 border-gray-500" />
                    </div>
                </div>
            </div>
            <div className="md:flex justify-between mt-10">
                <div className='md:w-1/2'>
                    <p>Address Details</p>
                    <p className='text-[11px]' >Default shipping address</p>
                </div>
                <div className='md:w-1/2 md:mt-0 mt-8'>
                    <p>Phone Number</p>
                    <input  className="border w-[80%] mt-1 border-1 px-4 py-3 border-gray-500" />

                    <div className='mt-5' >
                        {' '}
                        <p>Address</p>
                        <textarea rews={18}  className="border w-[80%] mt-1 border-1 px-4 py-3 border-gray-500" />
                    </div>
                </div>
            </div>
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
                            <div className="md:flex md:space-x-8 w-full ">
                                <div className="bg-white h-fit rouded-lg p-4 md:block md:mb-0 mb-6 flex justify-between md:w-[20%]">
                                    {nav.map((items, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setIndexValue(index)}
                                            className="mb-8 cursor-pointer ">
                                            <div className="flex items-center space-x-4">
                                                <div className="md:block hidden">
                                                    <img
                                                        alt=""
                                                        src={items.img}
                                                    />
                                                </div>

                                                <div>
                                                    <div className="text-black md:font-[500] font-semibold md:text-[13px] text-[9px]">
                                                        {items.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {index === 0 && (
                                    <div className="w-full md:w-[90%]">
                                        {myaccount}
                                    </div>
                                )}

                                {index === 1 && (
                                    <div className="w-full md:w-[90%]">
                                        {wlist}
                                    </div>
                                )}

                                {index === 2 && (
                                    <div className="w-full md:w-[90%]">
                                        {carthist}
                                    </div>
                                )}

                                {index === 3 && (
                                    <div className="w-full md:w-[90%]">
                                        {loyalty}
                                    </div>
                                )}
                                    {index === 4 && (
                                    <div className="w-full md:w-[90%]">
                                        {account}
                                    </div>
                                )}
                                {/* <div className="w-[90%]">{wlist}</div> */}
                            </div>
                        </div>
                    </div>
                    <Modal
                        open={openModal}
                        style={{ top: 180 }}
                        onCancel={handleCloseModal}
                        footer={false}>
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            type="number"
                            className=" py-3 rounded-md w-full px-3 border border-1 "
                        />
                        <div className="mt-4">
                            <button
                                className="bg-[#F5128F] py-4 w-[50%] px-3 text-white rounded-md "
                                onClick={submitpoint}>
                                submit
                            </button>
                        </div>
                    </Modal>
                </div>
            </PageContainer>
        </>
    );
}
