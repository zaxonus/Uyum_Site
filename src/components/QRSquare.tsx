// import React from 'react';
// import Image from 'next/image';
// import "./QRSquare.css";


export default function QRSquare(
{
	qrTxt
}: {
  qrTxt: string
}
) {

	const makeQR_URL = (url:string) => {
		let resURL = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='
		resURL += url
		return resURL
	}
	
		return (
    <>
			<div id="qrBx">
        <img src={makeQR_URL(qrTxt)}
             alt="QR code image"
             width={150}
             height={150} />
      </div>
    </>
  );
}