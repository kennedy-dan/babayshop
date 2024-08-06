import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    getcategories,
    getCategoriesWithProducts,
    addtocart,
} from '~/redux/features/productSlice';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CiShoppingCart } from 'react-icons/ci';
import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';

const HomeDefaultTopCategories = () => {
    const dispatch = useDispatch();
    const { getcats, categoriesWithProducts } = useSelector(
        (state) => state.product
    );

    useEffect(() => {
        dispatch(getcategories());
    }, []);
    useEffect(() => {
        dispatch(getCategoriesWithProducts());
    }, []);

    const addToCart = (id) => {
        const data = {
            product_id: id,
            quantity: 1,
        };
        dispatch(addtocart(data));
        toast.success('done');
    };
    const catsData = getcats?.results?.data;

    return (
        <div className="ps-top-categories">
            <div className="ps-container">
                <h3>Top categories of the month</h3>
                <div className="row">
                    {catsData?.map((items) => (
                        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 ">
                            <div className="ps-block--category">
                                <Link
                                    href={`/shop/${items?.id}`}
                                    className="ps-block__overlay"
                                />
                                <img
                                    src="/static/img/categories/1.jpg"
                                    alt="martfury"
                                />
                                <p>{items?.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {categoriesWithProducts?.results?.map((items) => (
                    <div className="mb-16">
                        <div className="flex justify-between px-3 w-full bg-gray-300 py-4">
                            <div className="">
                                <p className="text-black ">{items?.name}</p>
                            </div>
                            <div>
                                <Link href={`/shop/${items?.id}`}>
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-6">
                            {items?.products?.slice(0, 6)?.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover="hover"
                                    initial="rest"
                                    animate="rest">
                                    <div className="relative">
                                        <img
                                            src={
                                                item?.image_url
                                                    ? item?.image_url
                                                    : '/static/toy.jpg'
                                            }
                                            alt=""
                                            className="h-[200px] object-contain rounded-lg cursor-pointer"
                                        />
                                        <motion.div
                                            className="flex absolute bottom-0 left-0 justify-center right-0 bg-white bg-opacity-80 p-2"
                                         
                                            variants={{
                                                rest: { opacity: 0, y:'100%' },
                                                hover: { y: 0, opacity: 1  },
                                            }}
                                            transition={{ duration: 0.3 }}>
                                            <div
                                                onClick={() =>
                                                    addToCart(item?.id)
                                                }
                                                className="cursor-pointer mr-2">
                                                <CiShoppingCart size={24} />
                                            </div>
                                            <div className="cursor-pointer">
                                                <MdFavoriteBorder size={24} />
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div>
                                        <p className='uppercase' >{item?.name}</p>
                                    </div>
                                    <hr className="my-2" />
                                    <div >
                                        <p className='text-blue-600' >{item?.description}</p>
                                    </div>
                                    <div className="text-black font-semibold text-[20px] flex items-center">
                                        <img src="/static/Naira.png" alt="" />
                                        <p className="pl-1">
                                            {Math.floor(item?.price)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeDefaultTopCategories;
