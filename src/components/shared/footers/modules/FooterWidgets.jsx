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
                <li className="text-[#fafafa]">
                    <Link href="/page/blank">
                        <div className="text-[#fafafa]">Policy</div>
                    </Link>
                </li>

                <li>
                    <Link href="/page/blank"><div className="text-[#fafafa]">Term & Condition</div></Link>
                </li>
             
                <li>
                    <Link href="/page/faqs"><div className="text-[#fafafa]">return</div></Link>
                </li>
            </ul>
        </aside>

        <aside className="widget widget_footer">
            <h4 className="widget-title text-white">Bussiness</h4>
            <ul className="ps-list--link">
               
                <li>
                    <Link href="/account/checkout"><div className="text-[#fafafa]">Checkout</div></Link>
                </li>
                <li>
                    <Link href="/account"><div className="text-[#fafafa]">My account</div></Link>
                </li>
                <li>
                    <Link href={'/shop/1'}><div className="text-[#fafafa]">Shop</div></Link>
                </li>
            </ul>
        </aside>
    </div>
);

export default FooterWidgets;
