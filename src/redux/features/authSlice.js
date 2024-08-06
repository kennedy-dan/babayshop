// import axios from "@/utils/axios";

import axios from '../../utils/axios'

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const _loginUser = createAsyncThunk(
  `customer/login`,
  async (payload) => {
    console.log(payload);
    const response = await axios.post("auth/login", payload);
    return response;
  }
);

export const _registerCustomer = createAsyncThunk(
  `customer/register`,
  async (payload) => {
    const response = await axios.post("auth/register", payload);
    return response;
  }
);

export const getUsers = createAsyncThunk(`customer/getUsers`, async () => {
  const response = await axios.get("user/profile");
  return response;
});

export const registerContributor = createAsyncThunk(
  `contributor/register`,
  async (data) => {
    console.log(data);
    return getCsrf().then(async () => {
      const response = await axios.post(`/contributor/register`, {
        asset_type_of_interest: data,
      });
      return response.data;
    });
  }
);

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
  user: null,
  token: null,
  loading: false,
  status: "idle",
  error: null,
  profileStatus: "idle",
  users: {
    result: null,
    isLoading: true,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOutCustomer: (state) => {
      state.token = null;
      state.user = null;
      state.contributorData = null;
      state.contributorToken = null;
      state.error = null;
      state.loading = false;
    },
    setCustomerModalDisplay: (state, { payload }) => {
      state.modalDisplay = payload;
    },
    updateProfilePicture: (state, { payload }) => {
      state.user = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(_loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(_loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(_loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        const { user } = payload?.data?.data;
        console.log(payload);
        console.log(user);

        state.token = payload?.data?.data?.token;
        state.user = user;
        state.contributorData = user.contributor_data;
        state.modalDisplay = false;
      });

    builder
      .addCase(_registerCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(_registerCustomer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(_registerCustomer.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.data.data;
        toast.success(payload.data.message);
      });

    builder
      .addCase(getUsers.pending, (state) => {
        state.users.isLoading = true;
      })
      .addCase(getUsers.rejected, (state) => {
        state.users.result = false;
      })
      .addCase(getUsers.fulfilled, (state, { payload }) => {
        state.users.result = false;

        state.users.result = payload.data.data;
        // toast.success(payload.data.message);
      });
  },
});

export const { logOutCustomer, setCustomerModalDisplay, updateProfilePicture } =
  authSlice.actions;
export default authSlice.reducer;
