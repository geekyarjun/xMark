// You CANNOT use `browser`/`chrome` here and you CANNOT interact with extension stuff like storage and tabs.

const XHR = XMLHttpRequest.prototype;

const open = XHR.open;
const send = XHR.send;
const setRequestHeader = XHR.setRequestHeader;

XHR.open = function () {
  this._requestHeaders = {};

  return open.apply(this, arguments);
};

XHR.setRequestHeader = function (header, value) {
  this._requestHeaders[header] = value;
  return setRequestHeader.apply(this, arguments);
};

function parseBlob(blob) {
  console.log("blob in parseBlob", blob);
  const reader = new FileReader();

  // Read as text
  reader.onload = function (event) {
    console.log("Blob content (text):", event.target.result);
  };

  // Handle errors
  reader.onerror = function (error) {
    console.error("Error reading blob:", error);
  };

  reader.readAsText(blob); // Read the blob as text
}

XHR.send = function () {
  this.addEventListener("load", function () {
    const url = this.responseURL;
    const responseHeaders = this.getAllResponseHeaders();
    console.log("this.responseURL", this.responseURL);
    console.log("this.responseType", this.responseType);
    try {
      //   if (this.responseType != "blob") {
      let responseBody;
      if (this.responseType === "" || this.responseType === "text") {
        responseBody = JSON.parse(this.responseText);
      } else if (this.responseType === "blob") {
        // responseBody = JSON.parse(this.responseText);
        parseBlob(this.response);
      } else {
        /* if (this.responseType === 'json') */
        responseBody = this.response;
      }
      // Do your stuff HERE.

      console.log("responseBody", responseBody);
      //   }
    } catch (err) {
      console.debug("Error reading or processing response.", err);
    }
  });

  return send.apply(this, arguments);
};

// Store the original fetch function
const originalFetch = window.fetch;

// Override the fetch function
window.fetch = async function (...args) {
  const [resource, config] = args;

  //   console.log("Intercepted fetch request to:", resource);

  // Log request headers and body (if available)
  if (config) {
    // console.log("Request Method:", config.method || "GET");
    // console.log("Request Headers:", config.headers);
    if (config.body) {
      try {
        const parsedBody = JSON.parse(config.body);
        // console.log("Request Body:", parsedBody);
      } catch {
        // console.log("Request Body:", config.body);
      }
    }
  }

  // Proceed with the request
  const response = await originalFetch(...args);
  //   console.log("@@response@@", response);

  // Clone the response to read its body (response can only be read once)
  const clonedResponse = response.clone();

  try {
    const contentType = clonedResponse.headers.get("content-type");
    let responseBody;

    if (contentType && contentType.includes("application/json")) {
      responseBody = await clonedResponse.json();
    } else {
      responseBody = await clonedResponse.text();
    }
    console.log("args[0]", args[0]);

    if (args[0]?.includes?.("api/graphql")) {
      console.log("Response Body:", responseBody);
    }
  } catch (err) {
    console.error("Error reading response body:", err);
  }

  // Return the original response
  return response;
};
