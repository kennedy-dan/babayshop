import axios from '../../utils/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const getAllProducts = createAsyncThunk(
    `customer/products`,
    async (data) => {
        const response = await axios.get('products/list', {
            params: {
                search: data?.search,
            },
        });
        return response;
    }
);

export const getSingleProduct = createAsyncThunk(
    `customer/getSingleProduct`,
    async (id) => {
        const response = await axios.get(`products/find/${id}`);
        return response;
    }
);

export const addtocart = createAsyncThunk(
    `customer/addToCart`,
    async (data) => {
        const response = await axios.post(`carts/add`, data);
        return response;
    }
);

export const getcartData = createAsyncThunk(
    'customer/getcartData',
    async (data) => {
        const response = await axios.get(`carts/in-cart`);
        return response.data;
    }
);

export const getsizes = createAsyncThunk(
    'customer/getsizes',
    async (data) => {
        const response = await axios.get(`sizes/list`);
        return response.data;
    }
);

export const RemoveFromCart = createAsyncThunk(
    'order/RemoveFromCart',
    async (data) => {
        const response = await axios.post(`carts/remove`, data);
        return response.data;
    }
);

export const getcategories = createAsyncThunk(
    'customer/getcategories',
    async (data) => {
        const response = await axios.get(`products/categories/list`);
        return response.data;
    }
);
export const getSingleCats = createAsyncThunk(
    `customer/getSingleCats`,
    async (id) => {
        const response = await axios.get(`products/list?category_id=${id}`);
        return response;
    }
);

//chekout

export const addtocheckout = createAsyncThunk(
    `customer/checkout`,
    async (data) => {
        const response = await axios.post(`checkout`, data);
        return response;
    }
);

export const verifyPayment = createAsyncThunk(
    `customer/verifyPayment`,
    async (data) => {
        const response = await axios.post(`checkout/verify`, {
            reference: data,
        });
        return response;
    }
);

export const orderHistory = createAsyncThunk(
    `customer/orderHistory`,
    async (data) => {
        const response = await axios.get(`orders/list`);
        return response;
    }
);
export const getStores = createAsyncThunk(`customer/getStores`, async (id) => {
    const response = await axios.get(`stores`);
    return response;
});

export const topSell = createAsyncThunk(`customer/topSell`, async (id) => {
    const response = await axios.get(`products/top-selling`);
    return response;
});

export const favAction = createAsyncThunk(
    `customer/favAction`,
    async (data) => {
        const response = await axios.post(
            `favorites/action`,
            { product_id: data.id },
            {
                params: {
                    action: data.action,
                },
            }
        );
        return response;
    }
);

export const getFavorites = createAsyncThunk(
    `customer/getFavorites`,
    async (data) => {
        const response = await axios.get(`favorites/list`, data);
        return response;
    }
);

export const getCategoriesWithProducts = createAsyncThunk(
    'customer/getCategoriesWithProducts',
    async (_, { dispatch }) => {
        const categoriesResponse = await dispatch(getcategories());
        const categories = categoriesResponse.payload;
        console.log(categories);

        const categoriesWithProducts = await Promise.all(
            categories?.data?.slice(0,8)?.map(async (category) => {
                const productsResponse = await dispatch(
                    getSingleCats(category.id)
                );
                console.log(productsResponse)


                const products = productsResponse.payload.data.data.data;
                return {
                  ...category,
                  products: products, // Only take the first 3 products
                };
        
            })
        );

        console.log('Categories with products:', categoriesWithProducts);

        return categoriesWithProducts;
    }
);

export const getPages = createAsyncThunk(`customer/pages`, async () => {
    const response = await axios.get("pages");
    return response;
  });

  export const valCoupons = createAsyncThunk(`customer/valCoupons`, async (data) => {
    const response = await axios.get(`coupons/validate/${data}`);
    return response;
  });

  export const redeemPoint = createAsyncThunk(`customer/redeemePoint`, async (data) => {
    const response = await axios.post("loyalty-points/redeem", data);
    return response;
  });

    export const getredeemPoint = createAsyncThunk(`customer/getredeemPoint`, async (data) => {
    const response = await axios.get("loyalty-points/coupons");
    return response;
  });

// export const contributorLogin = createAsyncThunk(
// 	`contributor/register`,
// 	async ({ createData, cateID }) => {
// 		return getCsrf().then(async () => {
// 			const response = await axios.post(
// 				`/account/contributor/categories/${cateID}/register-auth-user`,
// 				createData
// 			);
// 			return response;
// 		});
// 	}
// );

const initialState = {
    allproducts: {
        results: null,
        isLoading: true,
    },
    singleproducts: {
        results: null,
        isLoading: true,
    },

    addcart: {
        isLoading: false,
        results: null,
        success: false,
    },

    addredeem: {
        isLoading: false,
        results: null,
    },

      getredeem: {
        isLoading: false,
        results: null,
    },
    sizes: {
        isLoading: false,
        results: null,
    },

    getcart: {
        isLoading: false,
        results: null,
    },

    valcoupons: {
        isLoading: false,
        results: null,
        success: false
    },

    removecart: {
        isLoading: false,
        results: null,
    },

    getcats: {
        results: null,
        isLoading: true,
    },
    getpages: {
        results: null,
        isLoading: true,
    },

    singlecats: {
        results: null,
        isLoading: true,
    },

    checkout: {
        results: null,
        isLoading: false,
        success: false,
    },
    verify: {
        results: null,
        isLoading: false,
    },
    getOrder: {
        results: null,
        isLoading: true,
    },

    search: {
        results: null,
        isLoading: true,
    },
    getstore: {
        results: null,
        isLoading: true,
    },

    topsell: {
        results: null,
        isLoading: true,
    },

    favaction: {
        results: null,
        isLoading: false,
    },

    getfav: {
        results: null,
        isLoading: false,
    },
    categoriesWithProducts: {
        results: null,
        isLoading: true,
    },
};

export const productSlice = createSlice({
    name: 'auth',
    initialState,

    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.allproducts.isLoading = true;
            })
            .addCase(getAllProducts.fulfilled, (state, { payload }) => {
                state.allproducts.isLoading = false;
                state.allproducts.results = payload;
            })
            .addCase(getAllProducts.rejected, (state) => {
                state.allproducts.isLoading = true;
            });

        //single products
        builder
            .addCase(getSingleProduct.pending, (state) => {
                state.singleproducts.isLoading = true;
            })
            .addCase(getSingleProduct.fulfilled, (state, { payload }) => {
                state.singleproducts.isLoading = false;
                state.singleproducts.results = payload;
            })
            .addCase(getSingleProduct.rejected, (state) => {
                state.singleproducts.isLoading = true;
            });

        //add to cart
        builder
            .addCase(addtocart.pending, (state) => {
                state.addcart.isLoading = true;
                state.addcart.success = false;
            })
            .addCase(addtocart.fulfilled, (state, { payload }) => {
                state.addcart.isLoading = false;
                state.addcart.success = true;

                state.addcart.results = payload;
                toast.success('Added to cart')
            })
            .addCase(addtocart.rejected, (state, { payload }) => {
                console.log(payload);
                state.addcart.isLoading = true;
                state.addcart.success = false;
            });

        //GET CART
        builder
            .addCase(getcartData.pending, (state) => {
                state.getcart.isLoading = true;
            })
            .addCase(getcartData.fulfilled, (state, { payload }) => {
                state.getcart.isLoading = false;
                state.getcart.results = payload;
            })
            .addCase(getcartData.rejected, (state) => {
                state.getcart.isLoading = true;
            });

        //remove to cart
        builder
            .addCase(RemoveFromCart.pending, (state) => {
                state.removecart.isLoading = true;
            })
            .addCase(RemoveFromCart.fulfilled, (state, { payload }) => {
                state.removecart.isLoading = false;
                state.removecart.results = payload;
            })
            .addCase(RemoveFromCart.rejected, (state) => {
                state.removecart.isLoading = true;
            });

        //categories
        builder
            .addCase(getcategories.pending, (state) => {
                state.getcats.isLoading = true;
            })
            .addCase(getcategories.fulfilled, (state, { payload }) => {
                state.getcats.isLoading = false;
                state.getcats.results = payload;
            })
            .addCase(getcategories.rejected, (state) => {
                state.getcats.isLoading = true;
            });

        builder
            .addCase(getSingleCats.pending, (state) => {
                state.singlecats.isLoading = true;
            })
            .addCase(getSingleCats.fulfilled, (state, { payload }) => {
                state.singlecats.isLoading = false;
                state.singlecats.results = payload;
            })
            .addCase(getSingleCats.rejected, (state) => {
                state.singlecats.isLoading = true;
            });

            builder
            .addCase(getsizes.pending, (state) => {
                state.sizes.isLoading = true;
            })
            .addCase(getsizes.fulfilled, (state, { payload }) => {
                state.sizes.isLoading = false;
                state.sizes.results = payload;
            })
            .addCase(getsizes.rejected, (state) => {
                state.sizes.isLoading = true;
            });

            builder
            .addCase(getPages.pending, (state) => {
                state.getpages.isLoading = true;
            })
            .addCase(getPages.fulfilled, (state, { payload }) => {
                state.getpages.isLoading = false;
                state.getpages.results = payload;
            })
            .addCase(getPages.rejected, (state) => {
                state.getpages.isLoading = true;
            });
            //VAL COUPONS
            builder
            .addCase(valCoupons.pending, (state) => {
                state.valcoupons.isLoading = true;
                state.valcoupons.success = false;
            })
            .addCase(valCoupons.fulfilled, (state, { payload }) => {
                state.valcoupons.isLoading = false;
                state.valcoupons.success = true;

                state.valcoupons.results = payload;
                if(payload?.data?.code === 200){
                    toast.success('Coupon added successfully')

                }
                

            })
            .addCase(valCoupons.rejected, (state) => {
                state.valcoupons.isLoading = true;
                state.valcoupons.success = false;

            });

        builder
            .addCase(addtocheckout.pending, (state) => {
                state.checkout.isLoading = true;
                state.checkout.success = false;
            })
            .addCase(addtocheckout.fulfilled, (state, { payload }) => {
                state.checkout.isLoading = false;
                state.checkout.results = payload;
                if(payload?.data){
                    state.checkout.success = true;
          
                  }else {
                    state.checkout.success = false;
          
                  }
          
            })
            .addCase(addtocheckout.rejected, (state, { payload }) => {
                console.log(payload);
                state.checkout.isLoading = true;
            });

        builder
            .addCase(verifyPayment.pending, (state) => {
                state.verify.isLoading = true;
            })
            .addCase(verifyPayment.fulfilled, (state, { payload }) => {
                state.verify.isLoading = false;
                state.verify.results = payload;
            })
            .addCase(verifyPayment.rejected, (state, { payload }) => {
                console.log(payload);
                state.verify.isLoading = true;
            });
        builder
            .addCase(orderHistory.pending, (state) => {
                state.getOrder.isLoading = true;
            })
            .addCase(orderHistory.fulfilled, (state, { payload }) => {
                state.getOrder.isLoading = false;
                state.getOrder.results = payload;
            })
            .addCase(orderHistory.rejected, (state, { payload }) => {
                state.getOrder.isLoading = true;
            });

        builder
            .addCase(getStores.pending, (state) => {
                state.getstore.isLoading = true;
            })
            .addCase(getStores.fulfilled, (state, { payload }) => {
                state.getstore.isLoading = false;
                state.getstore.results = payload;
            })
            .addCase(getStores.rejected, (state, { payload }) => {
                state.getstore.isLoading = true;
            });

        builder
            .addCase(topSell.pending, (state) => {
                state.topsell.isLoading = true;
            })
            .addCase(topSell.fulfilled, (state, { payload }) => {
                state.topsell.isLoading = false;
                state.topsell.results = payload;
            })
            .addCase(topSell.rejected, (state, { payload }) => {
                state.topsell.isLoading = true;
            });

        builder
            .addCase(favAction.pending, (state) => {
                state.favaction.isLoading = true;
            })
            .addCase(favAction.fulfilled, (state, { payload }) => {
                state.favaction.isLoading = false;
                state.favaction.results = payload;
            })
            .addCase(favAction.rejected, (state, { payload }) => {
                state.favaction.isLoading = true;
            });

        builder
            .addCase(getFavorites.pending, (state) => {
                state.getfav.isLoading = true;
            })
            .addCase(getFavorites.fulfilled, (state, { payload }) => {
                state.getfav.isLoading = false;
                state.getfav.results = payload;
            })
            .addCase(getFavorites.rejected, (state, { payload }) => {
                state.getfav.isLoading = true;
            });

                builder
            .addCase(redeemPoint.pending, (state) => {
                state.addredeem.isLoading = true;
            })
            .addCase(redeemPoint.fulfilled, (state, { payload }) => {
                state.addredeem.isLoading = false;
                state.addredeem.results = payload;
            })
            .addCase(redeemPoint.rejected, (state, { payload }) => {
                state.addredeem.isLoading = true;
            });

                   builder
            .addCase(getredeemPoint.pending, (state) => {
                state.getredeem.isLoading = true;
            })
            .addCase(getredeemPoint.fulfilled, (state, { payload }) => {
                state.getredeem.isLoading = false;
                state.getredeem.results = payload;
            })
            .addCase(getredeemPoint.rejected, (state, { payload }) => {
                state.getredeem.isLoading = true;
            });

        builder
            .addCase(getCategoriesWithProducts.pending, (state) => {
                state.categoriesWithProducts.isLoading = true;
            })
            .addCase(
                getCategoriesWithProducts.fulfilled,
                (state, { payload }) => {
                    state.categoriesWithProducts.isLoading = false;
                    state.categoriesWithProducts.results = payload;
                }
            )
            .addCase(getCategoriesWithProducts.rejected, (state) => {
                state.categoriesWithProducts.isLoading = true;
            });
    },
});

export default productSlice.reducer;
