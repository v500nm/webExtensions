document.addEventListener("DOMContentLoaded", function () {
  const credentialsList = document.getElementById("credentialsList");

  // Load saved snippetData on popup open
  chrome.storage.local.get("snippetData", function (data) {
    const enteredSnippet = data.snippetData || [];
    renderCredentialsList(enteredSnippet);
  });

  // Function to render snippetData list
  function renderCredentialsList(credentialsArray) {
    credentialsList.innerHTML = ""; // Clear previous content

    credentialsArray.forEach(function (snippetData, index) {
      // Create the card element
      const card = document.createElement("div");
      card.classList.add("card");

      // Construct the card content
      card.innerHTML = `
                <div class="title">
                    <div class="name">
                        <h1>${snippetData.title}</h1>
                    </div>
                    <div class="actions">
                        <div title="copy" class="copy"></div>
                        <div title="remove" class="remove"></div>
                    </div>
                </div>
                <div class="editor">
                    <code contentEditable="true">
                        <p class="snippetGetCode">${snippetData.snippet}</p>
                    </code>
                </div>
            `;

      // Append the card to the credentialsList container
      credentialsList.appendChild(card);

      // Add event listener for the delete icon of this specific card
      const deleteIcon = card.querySelector(".remove");
      deleteIcon.addEventListener("click", function () {
        // Remove the corresponding entry from the list and the storage
        credentialsArray.splice(index, 1);
        chrome.storage.local.set({ snippetData: credentialsArray });
        renderCredentialsList(credentialsArray);

        // Show hover message
        const hoverMessage = document.createElement("div");
        hoverMessage.textContent = "Snippet deleted";
        hoverMessage.classList.add("hover-message");

        // Append hover message to the body
        document.body.appendChild(hoverMessage);

        // Remove hover message after a certain duration
        setTimeout(() => {
          document.body.removeChild(hoverMessage);
        }, 2000); // Adjust duration as needed
      });

      // Add event listener for the copy icon of this specific card
      // Assuming you have already imported tui-notification library

      const copyIcon = card.querySelector(".copy");
      copyIcon.addEventListener("click", function () {
        const snippetText = credentialsArray[index].snippet;
        navigator.clipboard
          .writeText(snippetText)
          .then(() => {
            console.log("Snippet copied to clipboard");
            // Show hover message
            const hoverMessage = document.createElement("div");
            hoverMessage.textContent = "Code copied!";
            hoverMessage.classList.add("hover-message");
            document.body.appendChild(hoverMessage);

            // Remove the hover message after a certain duration
            setTimeout(function () {
              document.body.removeChild(hoverMessage);
            }, 2000); // Adjust the duration as needed
          })
          .catch((error) => {
            console.error("Unable to copy snippet: ", error);
            // Optionally, handle errors
          });
      });
    });
  }
});
