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

        chrome.storage.local.set(
          { snippetData: enteredSnippet },
          function () {
            renderCredentialsList(enteredSnippet);
            form.reset();
          }
        );
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

      // Create delete icon
      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "X";
      deleteIcon.classList.add("delete-icon");

      // Add event listener to delete icon
      deleteIcon.addEventListener("click", function () {
        // Remove the corresponding entry from the list and the storage
        credentialsArray.splice(index, 1);
        chrome.storage.local.set({ snippetData: credentialsArray });
        renderCredentialsList(credentialsArray);
      });

      // Append title, password, and delete icon to list item
      listItem.appendChild(titleRender);
      listItem.appendChild(document.createElement("hr")); // Add line break
      listItem.appendChild(document.createTextNode(snippetData.snippet)); // Add snippet
      listItem.appendChild(deleteIcon);

      credentialsList.appendChild(listItem);
    });
  }

  // Load saved snippetData on popup open
  chrome.storage.local.get("snippetData", function (data) {
    const enteredSnippet = data.snippetData || [];
    renderCredentialsList(enteredSnippet);
  });
});
