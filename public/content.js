// // Wait for the DOM to load
// console.log("Content Script");

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("INSIDE DOCMCONTENT LOADED");
//   // Observe DOM changes to handle dynamic loading of posts
//   const observer = new MutationObserver((mutations) => {
//     try {
//       console.log("mutations", mutations);
//       // console.log("in mutation observer");
//       const pokemonListContainer = document.getElementById("pokemon-list"); // Adjust the selector to target LinkedIn's menu
//       // console.log("pokemonListContainer", pokemonListContainer);
//       if (!pokemonListContainer) return;

//       const pokemonChildren = Array.from(pokemonListContainer?.children) || [];
//       // console.log("pokemonChildren", pokemonChildren);

//       pokemonChildren.forEach((pokeChild) => {
//         // Check if the custom button already exists
//         // if (!pokeChild.querySelector(".custom-bookmark-button")) {
//         if (pokeChild.getAttribute("data-btn-added") === "true") return;

//         // Create a new button
//         const button = document.createElement("button");
//         button.className = "custom-bookmark-button";
//         button.innerText = "Bookmark Post";
//         button.style.cssText = `
//               display: block;
//               background: #0073b1;
//               color: white;
//               padding: 8px;
//               margin: 5px 0;
//               border: none;
//               border-radius: 4px;
//               cursor: pointer;
//             `;

//         // Add a click handler
//         button.addEventListener("click", () => {
//           // Send a message to the background script
//           chrome.runtime.sendMessage(
//             {
//               type: "BOOKMARK_POST",
//               data: {
//                 postContent: "This is the post content to bookmark",
//                 postId: "12345",
//                 title: document.title,
//                 url: window.location.href,
//               },
//             },
//             (response) => {
//               console.log("Response from background:", response);
//             }
//           );

//           // alert(`Bookmarked post:`);
//           // Here, you can also send data to storage or a server
//         });

//         // Append the button to the menu
//         pokeChild.appendChild(button);
//         pokeChild.setAttribute("data-btn-added", "true");
//         // }
//       });
//       // mutations.forEach((mutation) => {
//       // });
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   // requestIdleCallback(checkForDOM);
//   // const script = document.createElement("script");
//   // script.src = chrome.runtime.getURL("xml.js");
//   // console.log("script.src", script.src);
//   // document.head.appendChild(script);
//   // script.onload = () => script.remove();

//   (function () {
//     const originalFetch = window.fetch;
//     console.log("originalFetch", originalFetch);

//     window.fetch = async (...args) => {
//       const response = await originalFetch(...args);
//       console.log("response", response);

//       if (args[0].includes("/target-api/endpoint")) {
//         const clonedResponse = response.clone();
//         const data = await clonedResponse.json();

//         console.log("Intercepted response body:", data);

//         // Modify the response body if needed
//         const modifiedData = { ...data, addedKey: "newValue" };
//         return new Response(JSON.stringify(modifiedData), {
//           status: clonedResponse.status,
//           statusText: clonedResponse.statusText,
//           headers: clonedResponse.headers,
//         });
//       }

//       return response;
//     };
//   })();

//   // Start observing the body for changes
//   observer.observe(document.body, { childList: true, subtree: true });
// });

// // function interceptData() {
// //   var xhrOverrideScript = document.createElement("script");
// //   xhrOverrideScript.type = "text/javascript";
// //   xhrOverrideScript.innerHTML = `
// //   (function() {
// //     var XHR = XMLHttpRequest.prototype;
// //     var send = XHR.send;
// //     var open = XHR.open;
// //     XHR.open = function(method, url) {
// //         this.url = url; // the request url
// //         return open.apply(this, arguments);
// //     }
// //     XHR.send = function() {
// //         this.addEventListener('load', function() {
// //             console.log('this.response', this.response);
// //             // if (this.url.includes('<url-you-want-to-intercept>')) {
// //             //     var dataDOMElement = document.createElement('div');
// //             //     dataDOMElement.id = '__interceptedData';
// //             //     dataDOMElement.innerText = this.response;
// //             //     dataDOMElement.style.height = 0;
// //             //     dataDOMElement.style.overflow = 'hidden';
// //             //     document.body.appendChild(dataDOMElement);
// //             // }
// //         });
// //         return send.apply(this, arguments);
// //     };
// //   })();
// //   `;
// //   document.head.prepend(xhrOverrideScript);
// // }
// // function checkForDOM() {
// //   if (document.body && document.head) {
// //     interceptData();
// //   } else {
// //     requestIdleCallback(checkForDOM);
// //   }
// // }

const s = document.createElement("script");
s.src = chrome.runtime.getURL("injected.js");
s.onload = async function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
