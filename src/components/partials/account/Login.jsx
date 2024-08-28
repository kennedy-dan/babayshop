import React, {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import { unwrapResult } from "@reduxjs/toolkit";

import { Form, Input, notification, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { _loginUser, _resetUser, _verifyotp, _changePword } from '~/redux/features/authSlice';
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
export default function Login() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [email, setEmail] = useState("");
  const [hash, setHash] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [pWord, setPword] = useState("");
  const [newpWord, setnewPword] = useState("");
  const [openTrack, setOpenTrack] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [inputType1, setInputType1] = useState("password");

  const [openReset, setOpenReset] = useState(false);
  const [number, setNumber] = useState("");
  const [inputs, setInputs] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const handleChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setNumber(newInputs.join(""));

    // Move to the next input if it's not the last one
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  
    //reduc useselector
    const { token, loading } = useSelector((state) => state.auth);
  
    const login = () => {
      const data= {
        email: email,
        password: pWord
      }
      console.log('jnjnj')
      dispatch(_loginUser(data))
    }
  
    useEffect(() => {
     if(token) {
      router.push('/')
     }
    }, [token])

    const reset = async () => {
        if (!resetEmail) {
          toast.info("Email is required");
          return;
        }
    
        const data = {
          email: resetEmail,
        };
        const responseData = await dispatch(_resetUser(data));
    
        const response = unwrapResult(responseData);
        if (response?.data?.message) {
          setOpenVerify(true);
        }
    
        console.log(response);
      };
    
      const verify = async () => {
        if (!number) {
          toast.info("Otp  is required");
          return;
        }
    
        const data = {
          code: number,
        };
        const responseData = await dispatch(_verifyotp(data));
    
        const response = unwrapResult(responseData);
        if (response?.data?.data?.hash) {
          setHash(response?.data?.data?.hash);
          setOpenReset(true)
          setNumber("")
          setInputs["", "", "", ""]
        }
    
        console.log(response);
      };
    
    
      const change = async () => {
        if (!newpWord) {
          toast.info("Input password");
          return;
        }
    
        if(newpWord.length < 6){
          toast.info('Password must be up to 6 characters')
          return
        }
    
        const data = {
          hash: hash,
          password: newpWord
        };
        const responseData = await dispatch(_changePword(data));
    
        const response = unwrapResult(responseData);
        if (response?.data?.success) {
          setOpenVerify(false);
          setOpenReset(false)
          setOpenTrack(false)
        }
    
        console.log(response);
      };

      
      const handleTrackClose = () => {
        setOpenTrack(false);
      };
    
      const handleVerifyClose = () => {
        setOpenReset(false);
      };
    
      const handleTrackVerify = () => {
        setOpenVerify(false);
      };
    
      const handleTrackOpen = (id) => {
        setOpenTrack(true);
      };
    
    

    return (
        <div className="ps-my-account">
            <div className="container">
                <Form
                    className="ps-form--account"
                    onFinish={(e) => e.preventDefault()}>
                    <ul className="ps-tab-list">
                        <li className="active">
                            <Link href={'/account/login'}>Login</Link>
                        </li>
                        <li>
                            <Link href={'/account/register'}>Register</Link>
                        </li>
                    </ul>
                    <div className="ps-tab active" id="sign-in">
                        <div className="ps-form__content">
                            <h5>Log In Your Account</h5>
                            <div className="form-group">
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your email!',
                                        },
                                    ]}>
                                    <Input
                                        className="form-control"
                                        type="text"
                                        placeholder="Username or email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-group form-forgot">
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your password!',
                                        },
                                    ]}>
                                    <Input
                                        className="form-control"
                                        type="password"
                                        onChange={(e) => setPword(e.target.value)}
                                        value={pWord}
                                        placeholder="Password..."
                                    />
                                </Form.Item>
                            </div>
                            <div className="flex justiy-end cursor-pointer mt-2 " onClick={handleTrackOpen}>
            <p className="text-[#4FA9AB] text-[16px]">Forget password</p>
          </div>
                            <div className="form-group">
                                <div className="ps-checkbox">
                                    <input
                                        className="form-control"
                                        type="checkbox"
                                        id="remember-me"
                                        name="remember-me"
                                    />
                                    <label htmlFor="remember-me">
                                        Rememeber me
                                    </label>
                                </div>
                            </div>
                            <div className="form-group submit">
                                <button
                                    type="submit"
                                    onClick={login}
                                    className="ps-btn bg-[#F5128F] ps-btn--fullwidth">
                                    Login
                                </button>
                            </div>
                        </div>
                  
                    </div>
                </Form>
            </div>
            <Modal
        width={600}
        style={{ height: "", width: "600px" }}
        open={openTrack}
        onCancel={handleTrackClose}
        footer={false}
      >
        <div className="">
          <p className="font-semibold">Email</p>
          <input
            onChange={(e) => setResetEmail(e.target.value)}
            value={resetEmail}
            placeholder="Enter Your Email Address"
            className=" w-[96%] pl-5 outline-none border border-[#C9C5CC] bg-[#F9F9F9] rounded-lg py-5"
          />

          <div className="mt-10">
            <button
              onClick={reset}
              style={{color:'white'}}
              className="w-[96%] bg-[#F5128F] text-white py-3 rounded-lg font-semibold text-[16px] "
            >
              {loading ? <ClipLoader size={12} color="white" /> : <p>Reset</p>}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
      width={600}
      style={{ height: "", width: "600px" }}
      open={openVerify}
      onCancel={handleTrackVerify}
      footer={false}
    >
      <div className="font-montserrat">
        <div className="flex w-full justify-center">
          <img src="images/navbarlogo.png" alt="" className="" />
        </div>
        <p className="font-semibold text-[22px] md:text-[38px] text-center">Verification</p>

        <p className="md:text-[16px] text-[13px] font-[400] text-[#8A848F] text-center tracking-wide">
          An <span className='font-bold' >OTP</span> has been sent to your Email, Input the otp below
        </p>
        <div className="flex w-full justify-center mt-16">
          <div className="flex justify-center w-[80%] space-x-">
            {inputs.map((input, index) => (
              <div key={index}>
                <input
                  type="text"
                  maxLength={1}
                  value={input}
                  onChange={(e) => handleChange(index, e.target.value)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="bg-[#F9F9F9]  lg:pl-10 md:pl-5 pl-5 w-[71%] rounded-2xl md:py-10 py-5 border-[#C9C5CC] border"
                />
              </div>
            ))}
          </div>
        </div>
        {/* <div className="w-[70%] ml-14 mt-4">
          <p className="text-[#4FA9AB]">Resend Code</p>
        </div> */}
        <div className="mt-10 flex justify-center w-full">
          <div className="flex w-[80%] justify-center">
            <button
              style={{color:'white'}}

              className="w-full bg-[#F5128F] text-white py-6 rounded-lg font-semibold text-[16px]"
              onClick={verify}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
        width={600}
        style={{ height: "", width: "600px" }}
        open={openReset}
        onCancel={handleVerifyClose}
        footer={false}
      >
        <div className="">
          <p className="font-semibold">New Password</p>
          <input
            onChange={(e) => setnewPword(e.target.value)}
            value={newpWord}
            placeholder="Enter Your New Password"
            
            className=" w-[96%] pl-5 outline-none border border-[#C9C5CC] bg-[#F9F9F9] rounded-lg py-5"
          />

          <div className="mt-10">
            <button
              onClick={change}
              style={{color:'white'}}

              className="w-[96%] bg-[#F5128F] text-white py-3 rounded-lg font-semibold text-[16px] "
            >
              {loading ? <ClipLoader size={12} color="white" /> : <p>Change password</p>}
            </button>
          </div>
        </div>
      </Modal>
        </div>
    );
}
