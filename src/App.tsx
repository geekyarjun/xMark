/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [newBookmark, setNewBookmark] = useState("");

  // Fetch existing bookmarks
  useEffect(() => {
    try {
      console.log("chrome>>", chrome);
      chrome.bookmarks.getTree((bookmarkTree: any) => {
        console.log("bookmarkTree:15", bookmarkTree);
        setBookmarks(bookmarkTree?.[0]?.children || []);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Handle bookmark form submission
  const handleAddBookmark = () => {
    try {
      console.log("chrome in handleAddBookmark", chrome);
      if (newBookmark) {
        chrome.bookmarks.create(
          {
            parentId: "1", // You can adjust this based on where you want to add the bookmark
            title: newBookmark,
            url: "https://www.example.com", // This can be dynamic or user input
          },
          () => {
            setNewBookmark("");
            // Re-fetch the bookmarks
            chrome.bookmarks.getTree((bookmarkTree) => {
              console.log("bookmarkTree:34", bookmarkTree);
              setBookmarks(bookmarkTree[0].children || []);
            });
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="popup">
      <h1>My Chrome Extension</h1>
      <div>
        <input
          type="text"
          value={newBookmark}
          onChange={(e) => setNewBookmark(e.target.value)}
          placeholder="Bookmark Name"
        />
        <button onClick={handleAddBookmark}>Add Bookmark</button>
      </div>
      <div>
        <h3>Bookmarks:</h3>
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                {bookmark.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
