"use strict";

alert("Update Ship from Address on the `Address` Object and add API Key");

// POST Request URL
let URL = "https://onlinetools.ups.com/ship/v1801/rating/Shop";

// HTML elements
const rate1 = document.querySelector(".rate1");
const rate2 = document.querySelector(".rate2");
const rate3 = document.querySelector(".rate3");
const rate4 = document.querySelector(".rate4");
const rate5 = document.querySelector(".rate5");
const rate6 = document.querySelector(".rate6");
let pricing = document.querySelector(".pricing");
const address1 = document.querySelector(".address");
const city = document.querySelector(".city");
const state = document.querySelector(".state");
const postalCode = document.querySelector(".postalCode");
const submitBTN = document.querySelector(".submitBTN");

// Hide Pricing Output
pricing.hidden = true;

// Fetch Request... Use your own API key/ account info obvously
let upsRequest = async function () {
  let response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "AccessLicenseNumber": "", // FILL YOUR UPS API KEY HERE
    },
    body: JSON.stringify(address),
  });
  let result = await response.json();
  console.log(result); // Logs Data From UPS
  let rateResult = result.RateResponse.RatedShipment;

  // Array will display rates out of order if going by index based on address input. Learned this the hard way at first....
  // Used forEach to create side effects to display by Service Code
  rateResult.forEach(function (rate) {
    rate.Service.Code === "12" // 3 Day
      ? (rate6.innerHTML = `3 Day Transit: $${rate.TotalCharges.MonetaryValue}`)
      : rate.Service.Code === "02" // 2 Day
      ? (rate3.innerHTML = `2 Day Transit: $${rate.TotalCharges.MonetaryValue}`)
      : rate.Service.Code === "03" // Ground
      ? (rate4.innerHTML = `Ground Transit: $${rate.TotalCharges.MonetaryValue}`)
      : rate.Service.Code === "14" // Over Night AM
      ? (rate1.innerHTML = `1 Day AM Transit: $${rate.TotalCharges.MonetaryValue}`)
      : rate.Service.Code === "01" // Over Night Regular
      ? (rate2.innerHTML = `1 Day Regular $${rate.TotalCharges.MonetaryValue}`)
      : console.log();
  });
  return result;
};

submitBTN.addEventListener("click", function (e) {
  e.preventDefault();
  // Updates Address Object from HTML Element Input Fields
  let addressObject = address.RateRequest.Shipment.ShipTo.Address;
  addressObject.AddressLine = address1.value;
  addressObject.City = city.value;
  addressObject.StateProvinceCode = state.value;
  addressObject.PostalCode = postalCode.value;

  // API Call on Click Event
  upsRequest();
  pricing.hidden = false;
});

// Address Object. Manipulate the data how ever you would like but update your account info, address and all that because I obviously took mine out.
let address = {
  "UPSSecurity": {
    "UsernameToken": {
      "Username": "", // UPS Site UserName
      "Password": "", // UPS Site Password
    },
    "ServiceAccessToken": {
      "AccessLicenseNumber": "", // API Key Access License Number
    },
  },
  "RateRequest": {
    "Request": {
      "SubVersion": "1703",
      "TransactionReference": {
        "CustomerContext": " ",
      },
    },
    "Shipment": {
      "ShipmentRatingOptions": {
        "UserLevelDiscountIndicator": "TRUE",
      },
      "Shipper": {
        "Name": "TEST",
        "ShipperNumber": "", // UPS Account number goes here if you have one
        "Address": {
          "AddressLine": "",
          "City": "",
          "StateProvinceCode": "",
          "PostalCode": "",
          "CountryCode": "US",
        },
      },
      "ShipTo": {
        "Name": "TEST",
        "Address": {
          "AddressLine": `${address1}`,
          "City": `${city}`,
          "StateProvinceCode": `${state}`,
          "PostalCode": `${postalCode}`,
          "CountryCode": "US",
        },
      },
      "ShipFrom": {
        "Name": "TEST",
        // Update These ShipFrom Fields Below
        "Address": {
          "AddressLine": "",
          "City": "",
          "StateProvinceCode": "",
          "PostalCode": "",
          "CountryCode": "US",
        },
      },
      "Service": {
        // No need to change this since it will display all Services.
        "Code": "03",
        "Description": "Ground",
      },
      "ShipmentTotalWeight": {
        "UnitOfMeasurement": {
          "Code": "LBS",
          "Description": "Pounds",
        },
        "Weight": `10`, // Update weight accordingly. I use a CRM API to update the weights for my program. You can also use index DB in the memory array... just requires more maintenance.
      },
      "Package": {
        "PackagingType": {
          "Code": "02",
          "Description": "Package",
        },
        "Dimensions": {
          "UnitOfMeasurement": {
            "Code": "IN",
          },
          // Same as weight section above. I use a CRM API to update the dimensions based on our each product we sell.
          "Length": "14",
          "Width": "10",
          "Height": "10",
        },
        "PackageWeight": {
          "UnitOfMeasurement": {
            "Code": "LBS",
          },
          // Same as weight section above.
          "Weight": `10`,
        },
      },
    },
  },
};
