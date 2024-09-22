'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from 'antd/lib';
import { useDispatch, useSelector } from 'react-redux';
import { orderHistory } from '~/redux/features/productSlice';
import { format, parseISO } from 'date-fns';
import PageContainer from '~/components/layouts/PageContainer';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import Newletters from '~/components/partials/commons/Newletters';
const Orderhistory = () => {
    const dispatch = useDispatch();
    const [openTrack, setOpenTrack] = useState(false);
    const { getOrder } = useSelector((state) => state.product);

    const handleTrackClose = () => {
        setOpenTrack(false);
    };

    const handleTrackOpen = () => {
        setOpenTrack(true);
    };

    useEffect(() => {
        dispatch(orderHistory());
    }, []);

    const data = getOrder?.results?.data?.data;

    return (
        <PageContainer footer={<FooterDefault />} title="Shopping Cart">
            <section className="py-20 px-4 lg:px-[20px] lg:py-[20px] xl:px-[100px] xl:py-[100px] font-montserrat ">
                {data?.map((items, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 mb-8 rounded-lg md:p-[50px] p-[15px] ">
                        <div className="border md:px-9 px-3 md:space-y-0 space-y-4 py-4 md:flex justify-between bg-[#EBF6F6] ">
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
                                                  parseISO(
                                                      items?.payment?.date
                                                  ),
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
                            {/* <div>
                                <button
                                    onClick={handleTrackOpen}
                                    className=" bg-secondary text-white py-4 px-4 rounded-lg font-semibold text-[16px] ">
                                    Tracking Order
                                </button>
                            </div> */}
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
                                        alt=""
                                        className='md:h-[300px]md: w-[300px] h-[100px] w-[100px] object-contain'
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
                                            <p className="font-semibold text-black">
                                                N {item?.unit_price}
                                            </p>
                                        </p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                ))}
            </section>
            {/* <Newletters layout="container" /> */}

            <Modal open={openTrack} onCancel={handleTrackClose} footer={false}>
                <img src="/images/tracking.png" alt="" />
            </Modal>
        </PageContainer>
    );
};

export default Orderhistory;
