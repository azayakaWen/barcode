import React, { useEffect, useState } from "react"
import Quagga from "quagga"
import "../styles/BarcodeScanner.css"

function BarcodeScanner() {
  const [scannedBarcode, setScannedBarcode] = useState("")
  const [productName, setProductName] = useState("")
  const [ingredients, setIngredients] = useState([])

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
    setProductName(data.product.product_name)
    setIngredients(data.product.ingredients_tags)
  }

  function initializeScanner() {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector(".scanner-container"),
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
    setProductName("")
    setIngredients([])
  }

  return (
    <div className="scanner-container">
      {ingredients.length ? (
        <div className="ingredients">
          <h2>Product name: {productName}</h2>
          <h3>Ingredients:</h3>
          <div className="list-container">
            <ul>
              {ingredients.map((ingredient) => (
                <li className="ingredients-list" key={ingredient}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <h4>Scanned barcode: {scannedBarcode}</h4>
          <button className="scan-again-btn" onClick={handleReset}>
            Scan again
          </button>
        </div>
      ) : scannedBarcode ? (
        <p>Loading product data...</p>
      ) : (
        <p>Scanning...</p>
      )}
    </div>
  )
}

export default BarcodeScanner
