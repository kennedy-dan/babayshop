import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { Form, Input } from 'antd';
import { _registerCustomer } from '~/redux/features/authSlice';

export default function Register() {
    const dispatch = useDispatch();

    const router = useRouter();

    //useState
    const [reg, setReg] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pWord, setPword] = useState('');
    const [inputType1, setInputType1] = useState('password');
    const [inputType2, setInputType2] = useState('password');
    const [confirmPword, setConfirmPword] = useState('');
    const [success, setSuccess] = useState(false);

    //redux useSelector
    const { user, loading } = useSelector((state) => state.auth);

      const register = () => {
    if(name === '' || email === "" || pWord === "" || confirmPword === ""){
      toast.error('Input all fields')
      return
    }
    if(pWord !== confirmPword){
      toast.error('Password and confirm Password are not the same')
      return
    }
    const data= {
      email: email,
      password: pWord,
      name: name,
      password_confirm: confirmPword
    }

    
    dispatch(_registerCustomer(data))

  }
  useEffect(() => {
    
    if(user){
      router.push('/account/login')
    }
    
    }, [user])
    return (
        <div className="ps-my-account">
            <div className="container">
                <Form
                    className="ps-form--account"
                    onSubmit={(e) => e.preventDefault()}>
                    <ul className="ps-tab-list">
                        <li>
                            <Link href={'/account/login'}>Login</Link>
                        </li>
                        <li className="active">
                            <Link href={'/account/register'}>Register</Link>
                        </li>
                    </ul>
                    <div className="ps-tab active" id="register">
                        <div className="ps-form__content">
                            <h5>Register An Account</h5>
                            <div className="form-group form-forgot">
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your full name!',
                                        },
                                    ]}>
                                    <Input
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="form-control"
                                        type="name"
                                        placeholder="Full name..."
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-group">
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your email!',
                                        },
                                    ]}>
                                    <Input
                                        name="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="form-control"
                                        type="email"
                                        placeholder="Email address"
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
                                        type={inputType1}
                                        value={pWord}
                                        onChange={(e) =>
                                            setPword(e.target.value)
                                        }
                                        className="form-control"
                                        placeholder="Password..."
                                    />
                                </Form.Item>
                            </div>

                            <div className="form-group form-forgot">
                                <Form.Item
                                    name="confirm password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please cnfirm your password!',
                                        },
                                    ]}>
                                    <Input
                                        type={inputType2}
                                        value={confirmPword}
                                        onChange={(e) =>
                                            setConfirmPword(e.target.value)
                                        }
                                        className="form-control"
                                        placeholder="Confirm Password..."
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-group submit">
                                <button
                                onClick={register}
                                    type="submit"
                                    className="ps-btn ps-btn--fullwidth">
                                    Register
                                </button>
                            </div>
                        </div>
                        <div className="ps-form__footer">
                            <p>Connect with:</p>
                            <ul className="ps-list--social">
                                <li>
                                    <a className="facebook" href="#">
                                        <i className="fa fa-facebook" />
                                    </a>
                                </li>
                                <li>
                                    <a className="google" href="#">
                                        <i className="fa fa-google-plus" />
                                    </a>
                                </li>
                                <li>
                                    <a className="twitter" href="#">
                                        <i className="fa fa-twitter" />
                                    </a>
                                </li>
                                <li>
                                    <a className="instagram" href="#">
                                        <i className="fa fa-instagram" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}
