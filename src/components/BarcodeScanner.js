import React, { useEffect, useState } from "react"
import Quagga from "quagga"

function BarcodeScanner() {
  const [scannedBarcode, setScannedBarcode] = useState("")
  const [productData, setProductData] = useState(null)

  /* eslint-disable */
  useEffect(() => {
    initializeScanner()
  }, [])
  /* eslint-enable */

  async function fetchProductData(barcode) {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    )
    const data = await response.json()
    setProductData(data.product)
  }

  function initializeScanner() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#scanner-container"),
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err)
          return
        }
        console.log("Initialization finished. Ready to start")
        Quagga.start()
      }
    )

    Quagga.onDetected(function (data) {
      setScannedBarcode(data.codeResult.code)
      fetchProductData(data.codeResult.code)
    })
  }

  function handleReset() {
    setScannedBarcode("")
    setProductData(null)
  }

  return (
    <div id="scanner-container">
      {productData ? (
        <>
          <p>Product name: {productData.product_name}</p>
          <p>Brand: {productData.brands}</p>
          <p>Category: {productData.categories}</p>
          <p>Scanned barcode: {scannedBarcode}</p>
          <button onClick={handleReset}>Scan again</button>
        </>
      ) : scannedBarcode ? (
        <p>Loading product data...</p>
      ) : (
        <p>Scanning...</p>
      )}
    </div>
  )
}

export default BarcodeScanner

// import React, { useEffect, useState } from "react"
// import Quagga from "quagga"

// function BarcodeScanner() {
//   const [scannedBarcode, setScannedBarcode] = useState("")

//   useEffect(() => {
//     initializeScanner()
//   }, [])

//   function initializeScanner() {
//     Quagga.init(
//       {
//         inputStream: {
//           name: "Live",
//           type: "LiveStream",
//           target: document.querySelector("#scanner-container"),
//           constraints: {
//             width: { min: 640 },
//             height: { min: 480 },
//             facingMode: "environment",
//           },
//         },
//         decoder: {
//           readers: ["ean_reader"],
//         },
//       },
//       function (err) {
//         if (err) {
//           console.log(err)
//           return
//         }
//         console.log("Initialization finished. Ready to start")
//         Quagga.start()
//       }
//     )

//     Quagga.onDetected(function (data) {
//       setScannedBarcode(data.codeResult.code)
//     })
//   }

//   function handleReset() {
//     setScannedBarcode("")
//   }

//   return (
//     <div id="scanner-container">
//       {scannedBarcode ? (
//         <>
//           <p>Scanned barcode: {scannedBarcode}</p>
//           <button onClick={handleReset}>Scan again</button>
//         </>
//       ) : (
//         <p>Scanning...</p>
//       )}
//     </div>
//   )
// }

// export default BarcodeScanner
