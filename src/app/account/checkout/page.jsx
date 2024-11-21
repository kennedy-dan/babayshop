'use client';
import BreadCrumb from '~/components/elements/BreadCrumb';
import Checkout from '~/components/partials/account/Checkout';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import PageContainer from '~/components/layouts/PageContainer';
import Newletters from '~/components/partials/commons/Newletters';
import React, { useState, useEffect } from 'react';
import { Button, Radio, Select, ConfigProvider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PaystackButton } from 'react-paystack';
import Image from 'next/image';

import {
    addtocart,
    addtocheckout,
    getcartData,
    RemoveFromCart,
    getStores,
    getstate,
    getLoca,
} from '~/redux/features/productSlice';
import { payStackConfig } from '~/utils/paystackConfig';
import { ClipLoader } from 'react-spinners';

export default function Page() {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Shopping Cart',
            url: '/account/shopping-cart',
        },
        {
            text: 'Checkout Information',
        },
    ];

    const dispatch = useDispatch();
    const { getcart, checkout, getstore } = useSelector(
        (state) => state.product
    );
    const { token } = useSelector((state) => state.auth);

    const [checked, setChecked] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [loc, setLoc] = useState(null);
    const {statess} = useSelector(state => state.product)
    const [city, setCity] = useState('');
    const [cities, setCities] = useState(null);
    const [state, setState] = useState('');
    const { user } = useSelector((state) => state.auth);
    const [phone, setPhone] = useState('');
    const [txRef, setTxRef] = useState(null);
    const [finalamount, setFinalamount] = useState(null);
    const [coupon, setCoupon] = useState('');
    const [deliveryOption, setDeliveryOption] = useState('pickup');

    const storedata = getstore?.results?.data?.data;

    const [total, setTotal] = useState(0);

    const toggleChecked = () => {
        setChecked(!checked);
    };
    const toggleDisable = () => {
        setDisabled(!disabled);
    };
    const onChange = (e) => {
        console.log('checked = ', e.target.checked);
        setChecked(e.target.checked);
    };
     
    useEffect(() => {
        if(statess?.results?.data){
            setLoc(statess?.results?.data)
            // const locations = loc.sort(compare);

        }
      }, [statess?.results?.data])
    useEffect(() => {
        if (token) {
            dispatch(getcartData());
        }
        const coup = localStorage.getItem('coupon')
        setCoupon(coup)
        
    }, []);

    console.log(coupon)
    console.log(loc)

    useEffect(() => {
        if (state) {
            // Find the selected state in the data
            const selectedState = loc?.find(stateid => stateid?.id === state);
            console.log(loc)

            console.log(selectedState)
            console.log(state)
            
            // Set cities for the selected state
            if (selectedState) {
                setCities(selectedState?.cities.map(city => city));
            } else {
                setCities(null);
            }
        } else {
            setCities(null);
        }
    }, [state, loc]);

    const data = getcart?.results?.data?.data?.items;
    const customSelectStyles = {
        control: () => ({
            display: 'flex',
            border: '1px solid #ccc',
            height: '4rem',
            borderRadius: 24.2162,
            background: '#f0f0f0',
        }),
        menuList: (provided) => ({
            ...provided,
            textTransform: 'capitalize',
        }),
        input: (provided) => ({
            ...provided,
            margin: 0,
        }),
        singleValue: (provided) => ({
            ...provided,
            textTransform: 'capitalize',
            margin: 0,
        }),
        multiValue: (provided) => ({
            ...provided,
            textTransform: 'capitalize',
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: 13,
        }),
        valueContainer: (provided) => ({
            ...provided,
            fontSize: '100%',
            padding: '0 22.7027px',
        }),
        placeholder: (provided) => ({
            ...provided,
            margin: 0,
            color: '#9BA3AF',
        }),
    };
    const calculateTotal = () => {
        return data?.reduce((total, item) => {
            return total + item.price;
        }, 0);
    };

    useEffect(() => {
        setTotal(calculateTotal());
    }, [data]);

    useEffect(() => {
        dispatch(getstate())
    }, [])

    const handleCheckout = async () => {
        const data = {
            name: user?.first_name,
            email: user?.email,
            phone: phone,
            state: state,
            address: address,
            gateway: 'Paystack',
            country: country,
            city_id: city,
            payment_method: 'Card',
            coupon_code: coupon
        };

        try {
            const resultAction = await dispatch(addtocheckout(data));
            console.log(resultAction);

            if (addtocheckout.fulfilled.match(resultAction)) {
                const tx_ref = resultAction?.payload?.data?.data?.reference;
                const discountamount = resultAction?.payload?.data?.data?.final_amount;
                    localStorage.removeItem('coupon')
                setTxRef(tx_ref);
                setFinalamount(discountamount)
                console.log(resultAction);
            } else {
                // console.error('Failed to checkout:', resultAction.payload);
            }
        } catch (err) {}
    };

    console.log(cities)

    let customDetails = {
        title: 'RBW',
        // description: "Puchase a shop print",
        tx_ref: txRef,
        amount: parseInt(finalamount),
        // remarks: checkoutDetails.canvasResult?.transaction?.remarks,
    };

    const payConfig = payStackConfig(user, customDetails);

    console.log(txRef);

    const handleDeliveryOptionChange = (e) => {
        setDeliveryOption(e.target.value);
    };
    const handleSelected = (e) => {
        setAddress(e);
        console.log(e);
    };

    return (
        <PageContainer footer={<FooterDefault />} title="Checkout">
            <div className="ps-page--simple">
                <BreadCrumb breacrumb={breadCrumb} />
                <section className="py-20 px-10 lg:px-[20px] font-montserrat lg:py-[20px] xl:px-[100px] xl:py-[100px]">
                    <p className="font-bold text-[24px] pb-5">Checkout</p>
                    <div className="md:flex justify-between">
                        <div className="md:w-1/2">
                            <p>Door delivery</p>

                            <hr className="my-4" />

                            <>
                         
                                <div>
                                    <p className="font-bold pb-1 mt-9 text-[14px] ">
                                        First name
                                    </p>
                                    <input
                                        className="w-full py-5  border border-gray-400 px-4 text-[16px] outline-none "
                                        placeholder="Enter Name"
                                        value={user?.first_name}
                                    />
                                </div>
                                <div className="mt-10">
                                    <p className="font-bold pb-1 mt-9 text-[14px] ">
                                        Email Address
                                    </p>
                                    <input
                                        className="w-full py-5  px-4 text-[16px] border border-gray-400 outline-none "
                                        placeholder="Enter Email Address"
                                        value={user?.email}
                                    />
                                </div>
                                <div className="mt-10">
                                    <p className="font-bold pb-1 mt-9 text-[14px] ">
                                        Country
                                    </p>
                                    <input
                                        className="w-full py-5  px-4 text-[16px] border border-gray-400 outline-none "
                                        placeholder="Enter Country"
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                        value={country}
                                    />
                                </div>
                                <div className="mt-10">
                                    <p className="font-bold pb-1 mt-9 text-[14px] ">
                                        State
                                    </p>
                                    <ConfigProvider
                            theme={{
                                components: {
                                    Select: {
                                        optionSelectedFontWeight: 600,
                                    },
                                },
                                // ...customTheme,
                                token: {
                                    borderRadius: 7,
                                    controlHeight: 60,
                                    colorBgContainer: '#f0f0f0',
                                    fontSize: 16,
                                    // optionSelectedFontWeight: 300
                                },
                            }}>
                            <Select
                                styles={customSelectStyles}
                                id="state"
                                placeholder="State"
                                className={` w-full`}
                                showSearch
                                options={loc?.map((location) => ({
                                    value: location.id,
                                    label: location.name,
                                }))}
                                onChange={(e) =>
                                    setState(
                                        
                                        e 
                                    )
                                }
                                isClearable
                                classNamePrefix="react-select"
                            />
                        </ConfigProvider>
                                </div>
                                <div className="mt-10">
                                    <p className="font-bold pb-1 mt-9 text-[14px] ">
                                        city
                                    </p>
                                    <ConfigProvider
                            theme={{
                                components: {
                                    Select: {
                                        optionSelectedFontWeight: 600,
                                    },
                                },
                                // ...customTheme,
                                token: {
                                    borderRadius: 7,
                                    controlHeight: 60,
                                    colorBgContainer: '#f0f0f0',
                                    fontSize: 16,
                                    // optionSelectedFontWeight: 300
                                },
                            }}>
                            <Select
                                styles={customSelectStyles}
                                id="city"
                                placeholder="City"
                                showSearch
                                className={` w-full `}
                                options={cities?.map((city) => ({
                                    value: city?.id,
                                    label: city?.city_name,
                                }))}
                                onChange={(e) =>
                                    setCity(e)
                                }
                                isClearable
                                isDisabled={state === ''}
                                classNamePrefix="react-select"
                            />
                        </ConfigProvider>
                                </div>
                                <div className="mt-10">
                                    <p className="font-bold pb-1 mt-9 text-[14px] ">
                                        Phone
                                    </p>
                                    <input
                                        className="w-full py-5  px-4 text-[16px] border border-gray-400 outline-none "
                                        placeholder="Enter Email Address"
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        value={phone}
                                    />
                                </div>
                                <div className="mt-10">
                                    <p className="font-bold pb-1 mt-9 text-[14px] ">
                                        Address
                                    </p>
                                    <input
                                        className="w-full py-5  px-4 text-[16px] border border-gray-400 outline-none "
                                        placeholder="Enter Address"
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        value={address}
                                    />
                                </div>
                            </>
                        </div>

                        <div>
                            <div className="shadow-lg md:w-[540px] md:mt-0 mt-10 rounded-xl p-[20px] border-2  font-montserrat ">
                                <p className="font-bold text-[18px] md:text-[32px]">Summary</p>
                                {data?.map((items, index) => (
                                    <div key={index} className="w-full">
                                        <div className="flex w-full justify-between  font-montserrat">
                                            <div className="flex   ">
                                                <div className="w-1/">
                                                    <div>
                                                        <Image
                                                            src={
                                                                items?.product
                                                                    ?.image_url
                                                                    ? items
                                                                          ?.product
                                                                          ?.image_url
                                                                    : '/static/toy.jpg'
                                                            }
                                                            alt=""
                                                            className="w-[90px] h-[90px] mr-3 object-cover rounded-lg"
                                                            width={500}
                                                            height={500}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-1/">
                                                    <p className="font-[500] text-black text-[18px] w-[100%] ">
                                                        {items?.product?.name}
                                                    </p>
                                                    {items?.selected_size?.size_name  && <p>size: {items?.selected_size?.size_name}</p>}
                                                    
                                                </div>
                                            </div>
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
                                            {/* <div className="">
                  <div className="flex  items-center">
                    <button onClick={() => decreaseQuant(items)}>
                      <img src={"/images/sub.png"} alt="Decrease" />
                    </button>
                    <p className="text-black font-bold px-2 text-[13px]">
                      {items.quantity}
                    </p>
                    <button onClick={() => increaseQuant(items)}>
                      <img src={"/images/add.png"} alt="Increase" />
                    </button>
                  </div>

                  <div className="flex mt-10 cursor-pointer " onClick={() => removeCart(items)}>
                    <div>
                      <img src="/images/delete.png" alt="" />
                    </div>
                    <div>Remove</div>
                  </div>
                </div> */}
                                        </div>

                                        {/* <br /> */}
                                        <hr className="my-5" />
                                    </div>
                                ))}

                                <div className="flex justify-between font-[500] mt-7">
                                    <p className="text-[16px]">total</p>
                                    <p className="text-[16px]">
                                        N {total?.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex justify-between font-[500] mt-7">
                                    <p className="text-[16px]">Subtotal</p>
                                    <p className="text-[16px]">
                                        N {total?.toFixed(2)}
                                    </p>
                                </div>
                                {/* <div className="flex justify-between font-[500] py-6">
                <p className="text-[16px]">Tax</p>
                <p className="text-[16px]">N 4000</p>
              </div> */}

                                {/* <div className="flex justify-between font-[500]">
                                    <p className="text-[16px]">Discount</p>
                                    <p className="text-[16px]">N 0</p>
                                </div> */}
                                <div className="mt-10">
                                    {!checkout?.success && (
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full bg-[#F5128F] text-white py-4 rounded-lg font-semibold text-[16px] ">
                                            {checkout?.isLoading ? (
                                                <ClipLoader
                                                    size={12}
                                                    color="white"
                                                />
                                            ) : (
                                                <p className="text-white">
                                                    Proceed To Payment N{total}
                                                </p>
                                            )}
                                        </button>
                                    )}

                                    {checkout?.success && txRef && (
                                        <button
                                            // onClick={addtoCheckout}
                                            className="bg-[#F5128F] text-[16px] w-full mt-10 py-4 text-white ">
                                            <PaystackButton
                                                text="Make Payment"
                                                {...payConfig}
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {/* <Newletters layout="container" /> */}
        </PageContainer>
    );
}
