'use client';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd/lib";
import { addtocart, getSingleProduct, getcartData,  favAction,
  getFavorites,
  getAllProducts, } from "~/redux/features/productSlice";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
// import ProductDescription from "../UI/ProductDescription";
import { MdOutlineFavorite, MdFavorite } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const HomeDefaultDealOfDay = ({ collectionSlug, fullWidth = true }) => {
    const dispatch = useDispatch();
    const router = useRouter()
    const { allproducts, singleproducts, addcart } = useSelector((state) => state.product);
    const [openTrack, setOpenTrack] = useState(false);
  
    const [currentPage, setCurrentPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [currentItems, setCurrentItems] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState({});
  
    const metaData = allproducts?.results?.data?.metadata;
    const data = allproducts?.results?.data?.data?.data;
    const getSingleProductData = singleproducts?.results?.data?.data?.data;
    const { token } = useSelector((state) => state.auth);

    const ci = currentItems?.slice(0,3)
  
    const itemsPerPage = 10;
  
    const handleFavoriteClick = async (id, isFavorite) => {
      if(!token){
        toast.info('Login to add to favorite')
        router.push('/account/login')
        return
      }
      setLoadingFavorites((prev) => ({ ...prev, [id]: true }));
      const action = isFavorite ? "remove" : "add";
      try {
        await dispatch(favAction({ id, action })).unwrap();
        toast.success(
          `Product ${action === "add" ? "added to" : "removed from"} favorites`
        );
        dispatch(getFavorites()); // Refresh the favorites list
      
      dispatch(getAllProducts())
  
      } catch (error) {
        toast.error(`Failed to ${action} favorite: ${error.message}`);
      } finally {
        setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
      }
    };
  
    useEffect(() => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setCurrentItems(data?.slice(indexOfFirstItem, indexOfLastItem) || []);
    }, [currentPage, data]);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const handleTrackClose = () => {
      setOpenTrack(false);
    };
  
    const handleTrackOpen = (id) => {
      setOpenTrack(true);
      dispatch(getSingleProduct(id));
    };
  
    const handleSubtract = () => {
      if(quantity < 2){
        setQuantity(1)
      }else {
        setQuantity(quantity - 1)
  
      }
    }
  
    const handleAdd = () => {
      setQuantity(quantity + 1)
    }
  
    useEffect(() => {
      if(addcart.success){
        setOpenTrack(false);
        setQuantity(1)
  
      }
      
   
    }, [addcart.success])

    useEffect(() => {
      
   dispatch(getAllProducts())
    }, [])
    
    
  
   const addToCart = (id) => {
  
    const data = {
      product_id : id,
      quantity: quantity
    }
    dispatch(addtocart(data))
   }
  
   useEffect(() => {
    if(token){
      dispatch(getcartData());
  
    }
  }, [ addcart, token]);
    return (
      <section>
            <div className="ps-top-categories">
            <div className="ps-container">
        <h3>Featured Products</h3>
          <div className="">
  
            {!data?.length && <div className='mt-4' ><p className='font-[500] text-4xl' >No record found</p></div>}
        
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 ">
          {ci?.map((items, index) => (
              <div key={index} className="mt-6 font-urbanist">
                <div className="relative">
                  <Link href={`/product/${items?.id}`}>
                  <div
                    className="flex"
                    onClick={() => handleTrackOpen(items?.id)}
                  >
                    <img
                      src={
                        items?.image_url ? items?.image_url : "/static/toy.jpg"
                      }
                      alt=""
                      className=" h-full object-contain rounded-lg cursor-pointer"
                      width={500}
                      height={500}
                    />
                  </div>
                  </Link>
               
                  <div
                    className="absolute top-[10%] z-[100] right-[5%] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(items?.id, items?.is_favorite);
                    }}
                  >
                    {loadingFavorites[items?.id] ? (
                      // <ClipLoader size={20} color="#000000" />
                      <p></p>
                    ) : items?.is_favorite ? (
                      <MdFavorite size={14} color="red" />
                    ) : (
                      <MdOutlineFavorite size={14} color="white" />
                    )}
                  </div>
                </div>
  
                <div className="">
                  <p className="text-black font-semibold text-[20px]">
                    {items.name}
                  </p>
                  <div className="text-black font-semibold text-[20px] flex items-center">
                    <img src="/static/Naira.png" alt="" />
                    <p className="pl-1">{Math.floor(items.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* <Modal
          width={800}
          style={{ height: "", width: "600px" }}
          open={openTrack}
          onCancel={handleTrackClose}
          footer={false}
        >
             <ProductDescription singleproducts={singleproducts} getSingleProductData={getSingleProductData} handleSubtract={handleSubtract} handleAdd={handleAdd } addToCart={addToCart} quantity={quantity} addcart={addcart} />
  
         
        
        </Modal> */}
        </div>
        </div>
      </section>
    )
};

export default HomeDefaultDealOfDay;
