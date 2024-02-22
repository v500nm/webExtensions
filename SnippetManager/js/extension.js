document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("snippetForm");
  const credentialsList = document.getElementById("credentialsList");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const snippet = document.getElementById("snippet").value;

    if (title && snippet) {
      const snippetData = {
        title: title,
        snippet: snippet,
      };

      chrome.storage.local.get("snippetData", function (data) {
        const enteredSnippet = data.snippetData || [];
        enteredSnippet.push(snippetData);

        chrome.storage.local.set({ snippetData: enteredSnippet }, function () {
          renderCredentialsList(enteredSnippet);
          form.reset();
        });
      });
    } else {
      alert("Please enter a title and code snippet u desire to store");
    }
  });

  // Function to render snippetData list
  function renderCredentialsList(credentialsArray) {
    credentialsList.innerHTML = "";
    credentialsArray.forEach(function (snippetData, index) {
      const listItem = document.createElement("li");

      // Create title and password elements
      const titleRender = document.createElement("span");
      titleRender.textContent = `${snippetData.title}`;
      titleRender.className = "titleNameLI";

      const snippetBox = document.createElement("p");
      snippetBox.textContent = "";
      snippetBox.className = "snippetBox";

      // Create delete icon
      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "X";
      deleteIcon.classList.add("delete-icon");

      const viewIcon = document.createElement("span");
      viewIcon.textContent = "View";
      viewIcon.classList.add("view-icon");

      const copyIcon = document.createElement("span");
      copyIcon.textContent = "Copy";
      copyIcon.classList.add("copy-icon");

      copyIcon.addEventListener("click", function () {
        var copyText = snippetData.snippet;
        var textarea = document.createElement("textarea");
        textarea.value = copyText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        // Show the copied message
        var hoverMessage = document.createElement("div");
        hoverMessage.textContent = "Copied!";
        hoverMessage.classList.add("hover-message");

        // Append the hover message to the body
        document.body.appendChild(hoverMessage);

        // Remove the hover message after a certain duration
        setTimeout(function () {
          document.body.removeChild(hoverMessage);
        }, 2000); // Adjust the duration (in milliseconds) as needed
      });

      // Add event listener to delete icon
      deleteIcon.addEventListener("click", function () {
        // Remove the corresponding entry from the list and the storage
        credentialsArray.splice(index, 1);
        chrome.storage.local.set({ snippetData: credentialsArray });
        renderCredentialsList(credentialsArray);
      });

      viewIcon.addEventListener("click", function () {
        if (snippetBox.innerHTML === "") {
          viewIcon.textContent = "Close";
          const preElement = document.createElement("pre");
          preElement.textContent = snippetData.snippet;
          snippetBox.appendChild(preElement);
          Prism.highlightElement(preElement);
        } else {
          viewIcon.textContent = "View";
          snippetBox.innerHTML = "";
        }
      });

      // Append title, password, and delete icon to list item
      listItem.appendChild(titleRender);
      listItem.appendChild(deleteIcon);
      listItem.appendChild(document.createElement("hr"));
      listItem.appendChild(viewIcon);
      listItem.appendChild(copyIcon);
      listItem.appendChild(snippetBox);

      credentialsList.appendChild(listItem);
    });
  }

  // Load saved snippetData on popup open
  chrome.storage.local.get("snippetData", function (data) {
    const enteredSnippet = data.snippetData || [];
    renderCredentialsList(enteredSnippet);
  });
});
