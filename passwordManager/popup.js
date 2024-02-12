document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("passwordForm");
  const credentialsList = document.getElementById("credentialsList");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const description = document.getElementById("description").value;

    if (username && password) {
      const credentials = {
        username: username,
        password: password,
        description: description,
      };

      // Save credentials to local storage
      chrome.storage.local.get("credentials", function (data) {
        const savedCredentials = data.credentials || [];
        savedCredentials.push(credentials);

        chrome.storage.local.set(
          { credentials: savedCredentials },
          function () {
            renderCredentialsList(savedCredentials);
            form.reset();
          }
        );
      });
    } else {
      alert("Please fill in username and password fields.");
    }
  });

  // Function to render credentials list
  function renderCredentialsList(credentialsArray) {
    credentialsList.innerHTML = "";
    credentialsArray.forEach(function (credentials, index) {
      const listItem = document.createElement("li");

      // Create username and password elements
      const usernamePassword = document.createElement("span");
      usernamePassword.textContent = `${credentials.username} - ${credentials.password}`;

      // Create delete icon
      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "X";
      deleteIcon.classList.add("delete-icon");

      // Add event listener to delete icon
      deleteIcon.addEventListener("click", function () {
        // Remove the corresponding entry from the list and the storage
        credentialsArray.splice(index, 1);
        chrome.storage.local.set({ credentials: credentialsArray });
        renderCredentialsList(credentialsArray);
      });

      // Append username, password, and delete icon to list item
      listItem.appendChild(usernamePassword);
      listItem.appendChild(document.createElement("br")); // Add line break
      listItem.appendChild(document.createTextNode(credentials.description)); // Add description
      listItem.appendChild(deleteIcon);

      credentialsList.appendChild(listItem);
    });
  }

  // Load saved credentials on popup open
  chrome.storage.local.get("credentials", function (data) {
    const savedCredentials = data.credentials || [];
    renderCredentialsList(savedCredentials);
  });
});
