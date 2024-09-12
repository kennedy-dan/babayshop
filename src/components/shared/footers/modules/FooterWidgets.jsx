import React from 'react';
import Link from 'next/link';

const FooterWidgets = () => (
    <div className="ps-footer__widgets">
        <aside className="widget widget_footer widget_contact-us">
            <h4 className="widget-title text-white">Contact us</h4>
            <div className="widget_content">
               
                <ul className="ps-list--social">
                    <li>
                        <a className="facebook" href="#">
                            <i className="fa fa-facebook" />
                        </a>
                    </li>
                    <li>
                        <a className="twitter" href="#">
                            <i className="fa fa-twitter" />
                        </a>
                    </li>
                    <li>
                        <a className="google-plus" href="#">
                            <i className="fa fa-google-plus" />
                        </a>
                    </li>
                    <li>
                        <a className="instagram" href="#">
                            <i className="fa fa-instagram" />
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
        <aside className="widget widget_footer">
            <h4 className="widget-title text-white">Quick links</h4>
            <ul className="ps-list--link text-white">
                <li className='text-[#fafafa]' >
                    <Link href="/page/blank"><div className='text-[#fafafa]' >Policy</div></Link>
                </li>

                <li>
                    <Link href="/page/blank">Term & Condition</Link>
                </li>
                <li>
                    <Link href="/page/blank">Shipping</Link>
                </li>
                <li>
                    <Link href="/page/blank">Return</Link>
                </li>
                <li>
                    <Link href="/page/faqs">FAQs</Link>
                </li>
            </ul>
        </aside>
        <aside className="widget widget_footer">
            <h4 className="widget-title text-white">Company</h4>
            <ul className="ps-list--link text-white">
                <li className='text-white' >
                    <Link href="/page/about-us">About Us</Link>
                </li>
                <li>
                    <Link href="/page/blank">Affilate</Link>
                </li>
                <li>
                    <Link href="/page/blank">Career</Link>
                </li>
                <li>
                    <Link href="/page/contact-us">Contact</Link>
                </li>
            </ul>
        </aside>
        <aside className="widget widget_footer">
            <h4 className="widget-title text-white">Bussiness</h4>
            <ul className="ps-list--link">
                <li>
                    <Link href="/page/about-us">Our Press</Link>
                </li>
                <li>
                    <Link href="/account/checkout">Checkout</Link>
                </li>
                <li>
                    <Link href="/account/user-information">My account</Link>
                </li>
                <li>
                    <Link href={'/shop'}>Shop</Link>
                </li>
            </ul>
        </aside>
    </div>
);

export default FooterWidgets;
