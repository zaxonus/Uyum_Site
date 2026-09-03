
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
	} /* End of makeQR_URL */
	
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
} /* End of QRSquare */