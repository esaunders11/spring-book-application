let library = [];
let recommendedBooks = [];

const bookForm = document.getElementById('bookForm');
const bookGrid = document.getElementById('bookGrid');
const sortBy = document.getElementById('sortBy');

let selectedIndex = null;

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
    renderBooks();
  })
  .catch(err => {
    console.error("Error loading user:", err.message);
  });
};

bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !author) return;

  fetch("http://localhost:8080/home/add-book", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ title, author })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to add book');
    }
    return res.json();
  })
  .then(data => {
    const newBook = {
    title,
    author,
    genre: data.genre, 
    pages: data.pages,
    description: data.description,
    year: data.year,
    rating: data.rating,
    thumbnail: data.thumbnail,
    added: Date.now()
    }
    library.push(newBook);
    renderBooks();
  })
  .catch(err => {
    console.log('Unable to add book: ' + err.message);
    showError("Adding book failed.");
  });

  bookForm.reset();
});

sortBy.addEventListener('change', () => {
  renderBooks();
});

function renderBooks() {
  bookGrid.innerHTML = "";

  const sorted = [...library];
  const key = sortBy.value;
  if (key !== "added") {
    sorted.sort((a, b) => {
      if (key === "publishDate") return new Date(a[key]) - new Date(b[key]);
      if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
      return a[key] - b[key];
    });
  }

  sorted.forEach(book => {
    const card = document.createElement("div");
    console.log(book.thumbnail);
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.thumbnail || "default-cover.png"}" alt="${book.title}" />
      <div class="book-info">
        <strong>${book.title}</strong><br/>
        Author: ${book.author}<br/>
        Genre: ${book.genre}<br/>
        Pages: ${book.pages}<br/>
        Published: ${book.year}
      </div>
    `;

    let tappedOnce = false;
    card.addEventListener('click', () => {
    if (tappedOnce) {
      openModal(book);
      tappedOnce = false;
    } else {
      tappedOnce = true;
      setTimeout(() => tappedOnce = false, 300);

      if (selectedIndex === library.indexOf(book)) {
        document.querySelectorAll(".book-card").forEach(c => c.classList.remove("selected"));
        selectedIndex = null;
      } else {
        document.querySelectorAll(".book-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedIndex = library.indexOf(book);
      }
    }
  });

    bookGrid.appendChild(card);
  });
}

document.getElementById("deleteBookBtn").addEventListener("click", () => {
  if (selectedIndex === null) {
    alert("Please select a book to delete.");
    return;
  }

  var book = library.splice(selectedIndex, 1)[0];
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
  selectedIndex = null;
  renderBooks();
});

document.getElementById('recommendBookBtn').addEventListener("click", () => {
  if (selectedIndex === null) {
    alert("Please select a book to recommend from.");
    return;
  }

  recommendedBooks = [];
  var book = library[selectedIndex];
  fetch(`http://localhost:8080/recommend/with?title=${encodeURIComponent(book.title)}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token") 
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Failed to recommend books');
    }
    return res.json();
  })
  .then(data => {
    recommendedBooks = data.map(book => ({
    title: book.title,
    author: book.author,
    genre: book.genre,
    pages: book.pages,
    description: book.description,
    year: book.year,
    rating: book.rating,
    thumbnail: book.thumbnail || "default-cover.png",
    added: Date.now()
    }));
    openRecommenedModel(recommendedBooks);
  })
  .catch(err => {
      console.log('Unable to recommened books', err.message);
  });
  selectedIndex = null;
});

const recommendedModal = document.getElementById("recommendModal");
const recommendDetails = document.getElementById("recommendDetails");
const closeRecommendedModal = document.getElementById("closeRecommendedModal");
const recommendedGrid = document.getElementById("recommendedGrid");

function openRecommenedModel(recomendedBooks) {
  recommendedGrid.innerHTML = "";

  recomendedBooks.forEach(book => {
    const card = document.createElement("div");
    console.log(book.thumbnail);
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.thumbnail || "default-cover.png"}" alt="${book.title}" />
      <div class="book-info">
        <strong>${book.title}</strong><br/>
        Author: ${book.author}<br/>
        Genre: ${book.genre}<br/>
        Pages: ${book.pages}<br/>
        Published: ${book.year}
      </div>
    `;

    let tappedOnce = false;
    card.addEventListener('click', () => {
    if (tappedOnce) {
      openModal(book);
      tappedOnce = false;
    } else {
      tappedOnce = true;
      setTimeout(() => tappedOnce = false, 300);

      if (selectedIndex === recomendedBooks.indexOf(book)) {
        document.querySelectorAll(".book-card").forEach(c => c.classList.remove("selected"));
        selectedIndex = null;
      } else {
        document.querySelectorAll(".book-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedIndex = recomendedBooks.indexOf(book);
      }
    }
  });

    recommendedGrid.appendChild(card);
  });
  recommendedModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

closeRecommendedModal.addEventListener("click", () => {
  recommendedModal.classList.add("hidden");
  document.body.style.overflow = ""; 
});

recommendedModal.addEventListener("click", (e) => {
  if (e.target === recommendedModal) {
    recommendedModal.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

const modal = document.getElementById("bookModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

function openModal(book) {
  modalDetails.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Pages:</strong> ${book.pages}</p>
    <p><strong>Published:</strong> ${book.year}</p>
    <p><strong>Rating:</strong> ${book.rating || 'N/A'}</p>
    <p><strong>Description:</strong> ${book.description || 'No description available.'}</p>
  `;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; 
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.body.style.overflow = ""; 
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");

  setTimeout(() => {
    errorDiv.classList.add("hidden");
  }, 4000); 
}
