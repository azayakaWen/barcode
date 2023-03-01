import React, { useEffect, useState } from "react"
import Quagga from "quagga"

function BarcodeScanner() {
  const [scannedBarcode, setScannedBarcode] = useState("")

  useEffect(() => {
    initializeScanner()
  }, [])

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
    })
  }

  function handleReset() {
    setScannedBarcode("")
  }

  return (
    <div id="scanner-container">
      {scannedBarcode ? (
        <>
          <p>Scanned barcode: {scannedBarcode}</p>
          <button onClick={handleReset}>Scan again</button>
        </>
      ) : (
        <p>Scanning...</p>
      )}
    </div>
  )
}

export default BarcodeScanner
