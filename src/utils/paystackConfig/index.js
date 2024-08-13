
export const payStackConfig = (user, customDetails) => {

	console.log(customDetails)
	console.log(user)
	if(!customDetails){
		console.log(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEYS)
		console.log('gggyyg')
		return
	
	}

	console.log(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEYS)
	console.log('yjk')
	const config = {
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEYS,
		reference: customDetails.tx_ref,
		amount: (customDetails.amount) * 100,
		email: user?.email,
		currency: "NGN",
		Text: 'Pay Now',
		onSuccess: (response) => {
		
			customDetails.subscription
			? window.location.href=`http://localhost:3000?isSub=${
					customDetails.subscription ? customDetails.subscription : ""
			  }&d=${customDetails.subDiscount}&a=${customDetails.amount}&tx_ref=${customDetails.tx_ref}`
			:window.location.href= `http://localhost:3000/transactionComplete?status=completed&tx_ref=${customDetails.tx_ref}`
		  },
	
			metadata: {
			phone_number: user?.phone_number,
			name: `${user?.last_name} ${user?.first_name}`,
		},
	
	};
	
	return config;
};
