import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    getcategories,
    getCategoriesWithProducts,
    addtocart,
    getAllProducts,
} from '~/redux/features/productSlice';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CiShoppingCart } from 'react-icons/ci';
import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';

const HomeDefaultTopCategories = () => {
    const dispatch = useDispatch();
    const { getcats, categoriesWithProducts, allproducts } = useSelector(
        (state) => state.product
    );

    const allp = allproducts?.results?.data?.data?.data;
    useEffect(() => {
        dispatch(getcategories());
        dispatch(getAllProducts());
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
                <h3>Top categories </h3>
                <div className="grid grid-cols-6 gap-5">
                    {catsData?.slice(0, 6)?.map((items, index) => (
                        <div key={index} className=" ">
                            <div className="">
                                <Link
                                    href={`/shop/${items?.id}`}
                                    // className="ps-block__overlay"
                                />
                                <img
                                    src="/static/cats.png"
                                    alt="martfury"
                                    className="h-[190px] rounded-2xl"
                                />
                                <p className="text-center">{items?.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-40">
                    <div>
                        <h3>New Arrival</h3>
                    </div>
                    <div className="flex justify-between">
                        {allp?.slice(0, 4)?.map((data, index) => (
                              <motion.div
                              key={data.id}
                              whileHover="hover"
                              initial="rest"
                              animate="rest"
                              className="  "
                              >
                              <div className="relative">
                                  <div className="justify-cente flex  p-9 mb-4 " style={{ background: 'white' }}>
                                      <img
                                          src={
                                              data?.image_url
                                                  ? data?.image_url
                                                  : '/static/toy.jpg'
                                          }
                                          alt=""
                                          className="h-[200px] w-[240px] object-cover rounded-lg cursor-pointer"
                                      />
                                  </div>
   
                                  <motion.div
                                      className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                      variants={{
                                          rest: { opacity: 0, y: '100%' },
                                          hover: { y: -20, opacity: 1 },
                                      }}
                                      transition={{ duration: 0.3 }}>
                                      <div
                                          onClick={() => addToCart(data?.id)}
                                          className="cursor-pointer mr-2">
                                          <CiShoppingCart size={24} />
                                      </div>
                                      <div className="cursor-pointer">
                                          <MdFavoriteBorder size={24} />
                                      </div>
                                  </motion.div>
                                  <div className="text-center">
                                      <p className="uppercase">
                                          {data?.name}
                                      </p>
                                  </div>
                              </div>
   
                              <hr className="my-2" />
                              <div className="text-center">
                                  <p className="text-blue-600">
                                      {data?.description}
                                  </p>
                              </div>
                              <div className="text-black font-semibold text-[20px] flex justify-center items-center">
                                  <img src="/static/Naira.png" alt="" />
                                  <p className="pl-1">
                                      {Math.floor(data?.price)}
                                  </p>
                              </div>
                          </motion.div>
                        ))}
                    </div>
                </div>

                {categoriesWithProducts?.results?.slice(0, 2)?.map((items, index) => (
                    <div key={index} className="mb-16 mt-32">
                        <div className="flex justify-between  w-full">
                            <div className="">
                                <h3 className="text-black ">{items?.name}</h3>
                            </div>
                            <div>
                                <Link href={`/shop/${items?.id}`}>
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="flex space-x-12 mt-4">
                            {items?.products?.slice(0, 6)?.map((data) => (
                           <motion.div
                           key={data.id}
                           whileHover="hover"
                           initial="rest"
                           animate="rest"
                           className="  "
                           >
                           <div className="relative">
                               <div className="justify-cente flex  p-9 mb-4 " style={{ background: 'white' }}>
                                   <img
                                       src={
                                           data?.image_url
                                               ? data?.image_url
                                               : '/static/toy.jpg'
                                       }
                                       alt=""
                                       className="h-[200px] w-[240px] object-cover rounded-lg cursor-pointer"
                                   />
                               </div>

                               <motion.div
                                   className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                   variants={{
                                       rest: { opacity: 0, y: '100%' },
                                       hover: { y: -20, opacity: 1 },
                                   }}
                                   transition={{ duration: 0.3 }}>
                                   <div
                                       onClick={() => addToCart(data?.id)}
                                       className="cursor-pointer mr-2">
                                       <CiShoppingCart size={24} />
                                   </div>
                                   <div className="cursor-pointer">
                                       <MdFavoriteBorder size={24} />
                                   </div>
                               </motion.div>
                               <div className="text-center">
                                   <p className="uppercase">
                                       {data?.name}
                                   </p>
                               </div>
                           </div>

                           <hr className="my-2" />
                           <div className="text-center">
                               <p className="text-blue-600">
                                   {data?.description}
                               </p>
                           </div>
                           <div className="text-black font-semibold text-[20px] flex justify-center items-center">
                               <img src="/static/Naira.png" alt="" />
                               <p className="pl-1">
                                   {Math.floor(data?.price)}
                               </p>
                           </div>
                       </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className='flex justify-between mt-32' >
                    <div>
                        <img src='/static/ads4.png' alt='' />
                    </div>
                    <div>
                        <img src='/static/ads5.png' alt='' />
                    </div>
                </div>
                {categoriesWithProducts?.results?.slice(3, 5)?.map((items, index) => (
                    <div key={index} className="mb-16 mt-32">
                        <div className="flex justify-between  w-full">
                            <div className="">
                                <h3 className="text-black ">{items?.name}</h3>
                            </div>
                            <div>
                                <Link href={`/shop/${items?.id}`}>
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="flex space-x-12 mt-4">
                            {items?.products?.slice(0, 6)?.map((data) => (
                           <motion.div
                           key={data.id}
                           whileHover="hover"
                           initial="rest"
                           animate="rest"
                           className="  "
                           >
                           <div className="relative">
                               <div className="justify-cente flex  p-9 mb-4 " style={{ background: 'white' }}>
                                   <img
                                       src={
                                           data?.image_url
                                               ? data?.image_url
                                               : '/static/toy.jpg'
                                       }
                                       alt=""
                                       className="h-[200px] w-[240px] object-cover rounded-lg cursor-pointer"
                                   />
                               </div>

                               <motion.div
                                   className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                   variants={{
                                       rest: { opacity: 0, y: '100%' },
                                       hover: { y: -20, opacity: 1 },
                                   }}
                                   transition={{ duration: 0.3 }}>
                                   <div
                                       onClick={() => addToCart(data?.id)}
                                       className="cursor-pointer mr-2">
                                       <CiShoppingCart size={24} />
                                   </div>
                                   <div className="cursor-pointer">
                                       <MdFavoriteBorder size={24} />
                                   </div>
                               </motion.div>
                               <div className="text-center">
                                   <p className="uppercase">
                                       {data?.name}
                                   </p>
                               </div>
                           </div>

                           <hr className="my-2" />
                           <div className="text-center">
                               <p className="text-blue-600">
                                   {data?.description}
                               </p>
                           </div>
                           <div className="text-black font-semibold text-[20px] flex justify-center items-center">
                               <img src="/static/Naira.png" alt="" />
                               <p className="pl-1">
                                   {Math.floor(data?.price)}
                               </p>
                           </div>
                       </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
                <div className='w-full mt-32' >
                    <img src='/static/ads1.png' className='w-full'  />
                </div>

                {categoriesWithProducts?.results?.slice(6, 8)?.map((items, index) => (
                    <div key={index} className="mb-16 mt-32">
                        <div className="flex justify-between  w-full">
                            <div className="">
                                <h3 className="text-black ">{items?.name}</h3>
                            </div>
                            <div>
                                <Link href={`/shop/${items?.id}`}>
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="flex space-x-12 mt-4">
                            {items?.products?.slice(0, 6)?.map((data) => (
                           <motion.div
                           key={data.id}
                           whileHover="hover"
                           initial="rest"
                           animate="rest"
                           className="  "
                           >
                           <div className="relative">
                               <div className="justify-cente flex  p-9 mb-4 " style={{ background: 'white' }}>
                                   <img
                                       src={
                                           data?.image_url
                                               ? data?.image_url
                                               : '/static/toy.jpg'
                                       }
                                       alt=""
                                       className="h-[200px] w-[240px] object-cover rounded-lg cursor-pointer"
                                   />
                               </div>

                               <motion.div
                                   className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                   variants={{
                                       rest: { opacity: 0, y: '100%' },
                                       hover: { y: -20, opacity: 1 },
                                   }}
                                   transition={{ duration: 0.3 }}>
                                   <div
                                       onClick={() => addToCart(data?.id)}
                                       className="cursor-pointer mr-2">
                                       <CiShoppingCart size={24} />
                                   </div>
                                   <div className="cursor-pointer">
                                       <MdFavoriteBorder size={24} />
                                   </div>
                               </motion.div>
                               <div className="text-center">
                                   <p className="uppercase">
                                       {data?.name}
                                   </p>
                               </div>
                           </div>

                           <hr className="my-2" />
                           <div className="text-center">
                               <p className="text-blue-600">
                                   {data?.description}
                               </p>
                           </div>
                           <div className="text-black font-semibold text-[20px] flex justify-center items-center">
                               <img src="/static/Naira.png" alt="" />
                               <p className="pl-1">
                                   {Math.floor(data?.price)}
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
