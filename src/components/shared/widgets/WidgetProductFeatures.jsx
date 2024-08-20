import React from 'react';

const WidgetProductFeatures = () => {
    return (
        <aside className=" bg-[#F4F4F4] p-12  ">
         <div className='flex items-center spacee-x-8' >
            <div className='text-sm' >
                <p>Shipping Nationwide</p>
                <p>On-Time Delivery (Typically within 48 hour).</p>
            </div>
            <div>
                <img src='/static/deliv.png' alt='' />
            </div>
         </div>
        </aside>
    );
};

export default WidgetProductFeatures;
