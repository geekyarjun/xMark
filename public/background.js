chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "BOOKMARK_POST") {
    console.log("Received data from content script:", message.data);

    // chrome.bookmarks.create({
    //   parentId: "1", // You can adjust this based on where you want to add the bookmark
    //   title: document.title,
    //   url: window.location.href, // This can be dynamic or user input
    // });

    // Send a response back to the content script
    sendResponse({
      status: "success",
      message: message.data,
    });
  }
});
