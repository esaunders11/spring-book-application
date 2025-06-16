let library = [];

const tableBody = document.querySelector("#bookTable tbody");
const form = document.getElementById("addBookForm");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const genre = document.getElementById("genre").value.trim();
  const pages = parseInt(document.getElementById("pages").value);

  if (!title || !author || !genre || isNaN(pages)) {
    alert("All fields are required.");
    return;
  }

  const book = { title, author, genre, pages };
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
                     <td>${book.pages}</td>`;
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
  library.splice(index, 1);
  renderTable();
});

document.getElementById("resetLibrary").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset the library?")) {
    library = [];
    renderTable();
  }
});

document.getElementById("exportLibrary").addEventListener("click", () => {
  document.getElementById("exportPreview").value = library.map(b => 
    `${b.title},${b.author},${b.genre},${b.pages}`).join("\n");
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
    `Title: ${book.title}\nAuthor: ${book.author}\nGenre: ${book.genre}\nPages: ${book.pages}`;
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
