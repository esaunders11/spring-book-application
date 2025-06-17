let library = [];

const tableBody = document.querySelector("#bookTable tbody");
const form = document.getElementById("addBookForm");

window.onload = function() {
  const token = localStorage.getItem("token");
  console.log(token);
  fetch("http://localhost:8080/home/user", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  })
  .then(user => {
    console.log(user.name);
    user.books.forEach(book => {
      library.push(book)
    });
    renderTable();
  })
  .catch(err => {
    console.error("Error loading user:", err.message);
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const genre = document.getElementById("genre").value.trim();
  const length = parseInt(document.getElementById("pages").value);

  if (!title || !author || !genre || isNaN(length)) {
    alert("All fields are required.");
    return;
  }
  
  fetch('http://localhost:8080/home/add-book', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token") 
    },
    body: JSON.stringify({ title, author, genre, length })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to add book');
    }
    return res.json();
  })
  .catch(err => {
      console.log('Unable to add book');
  });

  const book = { title, author, genre, length };
  library.push(book);
  renderTable();
  form.reset();
});

function renderTable() {
  tableBody.innerHTML = "";
  library.forEach((book, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td>
                     <td>${book.author}</td>
                     <td>${book.genre}</td>
                     <td>${book.length}</td>`;
    row.addEventListener("dblclick", () => showBookInfo(book));
    row.dataset.index = index;
    tableBody.appendChild(row);
  });
}

document.getElementById("removeBook").addEventListener("click", () => {
  const selected = document.querySelector("tr.selected");
  if (!selected) {
    alert("Select a row to remove.");
    return;
  }
  const index = selected.dataset.index;
  var book = library.splice(index, 1)[0];
  fetch('http://localhost:8080/home/delete-book', {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token") 
    },
    body: JSON.stringify(book)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to remove book');
    }
    if (res.status !== 204) {
      return res.json();
    }
  })
  .catch(err => {
      console.log('Unable to remove book');
  });
  renderTable();
});


document.getElementById("exportLibrary").addEventListener("click", () => {
  document.getElementById("exportPreview").value = library.map(b => 
    `${b.title},${b.author},${b.genre},${b.length}`).join("\n");
  document.getElementById("exportModal").classList.remove("hidden");
});

document.getElementById("confirmExport").addEventListener("click", () => {
  const data = document.getElementById("exportPreview").value;
  const blob = new Blob([data], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "library_export.txt";
  a.click();
  closeModal();
});

function showBookInfo(book) {
  document.getElementById("infoText").textContent = 
    `Title: ${book.title}\nAuthor: ${book.author}\nGenre: ${book.genre}\nPages: ${book.length}`;
  document.getElementById("infoModal").classList.remove("hidden");
}

function closeModal() {
  document.querySelectorAll(".modal").forEach(modal => modal.classList.add("hidden"));
}

// Sort table
document.querySelectorAll("#bookTable th").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.dataset.col;
    library.sort((a, b) => {
      if (typeof a[col] === "string") {
        return a[col].localeCompare(b[col]);
      }
      return a[col] - b[col];
    });
    renderTable();
  });
});

// Select table row
tableBody.addEventListener("click", (e) => {
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach(r => r.classList.remove("selected"));
  if (e.target.closest("tr")) {
    e.target.closest("tr").classList.add("selected");
  }
});
