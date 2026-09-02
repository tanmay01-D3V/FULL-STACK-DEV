/* Circulation Desk — front-end for the Library Management API */
(function () {
  "use strict";

  var API = "/api";
  var state = {
    token: localStorage.getItem("lm_token") || null,
    user: null,
    books: [],
    filter: "",       // '' | 'available' | 'borrowed'
    search: "",
  };

  /* ---------- helpers ---------- */

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function shortId(id) {
    return String(id).slice(-6).toUpperCase();
  }

  function fmtDate(value) {
    if (!value) return "—";
    var d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return (
      d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    );
  }

  function api(path, opts) {
    opts = opts || {};
    var headers = { "Content-Type": "application/json" };
    if (state.token) headers.Authorization = "Bearer " + state.token;
    var init = {
      method: opts.method || "GET",
      headers: headers,
    };
    if (opts.body) init.body = JSON.stringify(opts.body);

    return fetch(API + path, init).then(function (res) {
      return res.json().catch(function () {
        return {};
      }).then(function (data) {
        if (!res.ok) {
          var msg = data.message || "Request failed (" + res.status + ").";
          if (data.errors && data.errors.length) {
            msg = data.errors.map(function (e) { return e.message; }).join(" · ");
          }
          var err = new Error(msg);
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  function toast(message, type) {
    var box = $("#toasts");
    var el = document.createElement("div");
    el.className = "toast" + (type === "err" ? " err" : "");
    el.innerHTML =
      '<span class="toast-mark">' +
      (type === "err" ? "Overdue notice" : "Stamped") +
      "</span>" +
      esc(message);
    box.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
      el.style.transition = "opacity .3s";
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 320);
    }, 3200);
  }

  /* ---------- auth ---------- */

  function showGate() {
    $("#gate").classList.remove("hidden");
  }

  function hideGate() {
    $("#gate").classList.add("hidden");
  }

  function enterApp(user) {
    state.user = user;
    hideGate();
    $("#userbar").classList.remove("hidden");
    $("#tabs").classList.remove("hidden");
    $("#userchip-name").textContent = user.name || "Reader";
    $("#userchip-role").textContent = user.role || "student";
    $("#tab-admin").classList.toggle("hidden", (user.role || "") !== "librarian");

    if ((user.role || "") !== "librarian") {
      checkTab("catalog");
    } else {
      checkTab("catalog");
    }
  }

  function leaveApp() {
    state.token = null;
    state.user = null;
    localStorage.removeItem("lm_token");
    $("#userbar").classList.add("hidden");
    $("#tabs").classList.add("hidden");
    showGate();
  }

  function setGateMode(mode) {
    var isRegister = mode === "register";
    $$(".gate-tab").forEach(function (t) {
      t.classList.toggle("is-active", t.dataset.mode === mode);
    });
    $('input[name="name"]').classList.toggle("hidden", !isRegister);
    $("#role-field").classList.toggle("hidden", !isRegister);
    $("#auth-submit").textContent = isRegister ? "Issue card" : "Sign in";
    $("#gate-error").textContent = "";
  }

  function setGateError(msg) {
    $("#gate-error").textContent = msg || "";
  }

  /* ---------- views ---------- */

  function checkTab(name) {
    $$(".tab-item").forEach(function (t) {
      t.classList.toggle("is-active", t.dataset.view === name);
    });
    $$(".view").forEach(function (v) {
      v.classList.toggle("hidden", v.id !== "view-" + name);
    });

    if (name === "catalog") loadCatalog();
    if (name === "loans") loadLoans();
    if (name === "admin") loadAdmin();
  }

  function stamp(status) {
    if (status === "available") return '<span class="stamp stamp-ok">In circulation</span>';
    if (status === "borrowed") return '<span class="stamp">Checked out</span>';
    if (status === "overdue") return '<span class="stamp">Overdue</span>';
    if (status === "returned") return '<span class="stamp stamp-ok">Returned</span>';
    if (status === "active") return '<span class="stamp">Due</span>';
    return '<span class="stamp">' + esc(status || "—") + "</span>";
  }

  /* ---------- catalog ---------- */

  function loadCatalog() {
    var q = state.search.trim();
    var path = q ? "/books/search?q=" + encodeURIComponent(q) : "/books";
    if (!q && state.filter) path += (path.indexOf("?") > -1 ? "&" : "?") + "status=" + state.filter;

    api(path)
      .then(function (data) {
        state.books = data.books || [];
        renderCatalog();
      })
      .catch(function (err) {
        $("#catalog-cards").innerHTML = "";
        $("#catalog-hint").textContent = err.message;
        toast(err.message, "err");
      });
  }

  function renderCatalog() {
    var hint = $("#catalog-hint");
    var wrap = $("#catalog-cards");

    if (!state.books.length) {
      wrap.innerHTML = "";
      hint.textContent = "Nothing matched — try another title or check back later.";
      return;
    }
    hint.textContent = "";
    wrap.innerHTML = state.books
      .map(function (b) {
        var canBorrow =
          state.user && state.user.role === "student" &&
          b.status === "available" && Number(b.quantity) > 0;
        return (
          '<article class="card">' +
          '<div class="card-top">' +
          '<span class="card-cat">' + esc(b.category || "uncatalogued") + "</span>" +
          stamp(b.status) +
          "</div>" +
          '<h3 class="card-title">' + esc(b.title) + "</h3>" +
          '<p class="card-author">' + esc(b.author || "Unknown author") + "</p>" +
          '<div class="card-meta">' +
          "<span>ISBN <b>" + esc(b.isbn || "—") + "</b></span>" +
          "<span>Copies <b>" + esc(b.quantity || 0) + "</b></span>" +
          "</div>" +
          '<div class="card-foot">' +
          '<span class="card-no">CARD NO. ' + shortId(b.bookId) + "</span>" +
          (canBorrow
            ? '<button class="btn btn-ink" data-act="borrow" data-id="' + esc(b.bookId) + '">Borrow</button>'
            : state.user && state.user.role === "librarian"
              ? '<button class="btn btn-danger" data-act="delete" data-id="' + esc(b.bookId) + '">Discard</button>'
              : "") +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    $$("[data-act]", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.dataset.id;
        if (btn.dataset.act === "borrow") borrowBook(id);
        if (btn.dataset.act === "delete") deleteBook(id);
      });
    });
  }

  function borrowBook(id) {
    api("/books/" + encodeURIComponent(id) + "/borrow", { method: "POST" })
      .then(function (data) {
        toast("Checked out — due " + fmtDate(data.dueDate) + ".");
        loadCatalog();
      })
      .catch(function (err) { toast(err.message, "err"); });
  }

  function deleteBook(id) {
    if (!window.confirm("Discard this book from the stacks?")) return;
    api("/books/" + encodeURIComponent(id), { method: "DELETE" })
      .then(function (data) {
        toast(data.message || "Book discarded.");
        loadCatalog();
      })
      .catch(function (err) { toast(err.message, "err"); });
  }

  /* ---------- loans ---------- */

  function loadLoans() {
    api("/transactions/my")
      .then(function (data) {
        renderLoans(data.transactions || []);
      })
      .catch(function (err) { toast(err.message, "err"); });
  }

  function renderLoans(transactions) {
    var tbody = $("#loans-table tbody");
    if (!transactions.length) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="empty">No loans on record. Browse the catalog to check out your first book.</td></tr>';
      return;
    }
    tbody.innerHTML = transactions
      .map(function (t) {
        var active = t.status === "active";
        return (
          "<tr>" +
          '<td class="mono">' + shortId(t.transactionId) + "</td>" +
          '<td><span class="book-t">' + esc(t.book ? t.book.title : "Unknown title") + "</span></td>" +
          '<td class="mono">' + esc(t.type || "—") + "</td>" +
          '<td class="mono">' + fmtDate(t.borrowDate) + "</td>" +
          '<td class="mono">' + fmtDate(t.dueDate) + "</td>" +
          "<td>" + stamp(t.status) + "</td>" +
          "<td>" +
          (active
            ? '<button class="btn btn-stamp" data-act="return" data-id="' + esc(t.bookId) + '">Return</button>'
            : "") +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    $$('[data-act="return"]', tbody).forEach(function (btn) {
      btn.addEventListener("click", function () {
        api("/books/" + encodeURIComponent(btn.dataset.id) + "/return", { method: "POST" })
          .then(function (data) {
            toast(data.message || "Book returned.");
            loadLoans();
            loadCatalog();
          })
          .catch(function (err) { toast(err.message, "err"); });
      });
    });
  }

  /* ---------- librarian ---------- */

  function loadAdmin() {
    api("/transactions")
      .then(function (data) {
        renderAllTransactions(data.transactions || []);
      })
      .catch(function (err) { toast(err.message, "err"); });

    api("/users")
      .then(function (data) {
        renderUsers(data.users || []);
      })
      .catch(function (err) { toast(err.message, "err"); });
  }

  function renderAllTransactions(transactions) {
    var tbody = $("#alltx-table tbody");
    if (!transactions.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="empty">The ledger is blank — no circulation yet.</td></tr>';
      return;
    }
    tbody.innerHTML = transactions
      .map(function (t) {
        return (
          "<tr>" +
          '<td class="mono">' + shortId(t.transactionId) + "</td>" +
          '<td>' + esc(t.user ? t.user.name : "—") + '<div class="mono">' + esc(t.user ? t.user.email : "") + "</div></td>" +
          '<td><span class="book-t">' + esc(t.book ? t.book.title : "Unknown title") + "</span></td>" +
          '<td class="mono">' + fmtDate(t.borrowDate) + "</td>" +
          '<td class="mono">' + fmtDate(t.dueDate) + "</td>" +
          "<td>" + stamp(t.status) + "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderUsers(users) {
    var tbody = $("#users-table tbody");
    if (!users.length) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="empty">No borrowers registered yet.</td></tr>';
      return;
    }
    tbody.innerHTML = users
      .map(function (u) {
        return (
          "<tr>" +
          "<td>" + esc(u.name) + "</td>" +
          '<td class="mono">' + esc(u.email) + "</td>" +
          '<td class="mono">' + fmtDate(u.createdAt) + "</td>" +
          "<td>" +
          '<select class="role-select" data-user="' + esc(u.userId) + '">' +
          '<option value="student"' + (u.role === "student" ? " selected" : "") + ">student</option>" +
          '<option value="librarian"' + (u.role === "librarian" ? " selected" : "") + ">librarian</option>" +
          "</select>" +
          "</td>" +
          "<td>" +
          '<button class="btn btn-danger" data-act="deluser" data-id="' + esc(u.userId) + '">Remove</button>' +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    $$(".role-select", tbody).forEach(function (sel) {
      sel.addEventListener("change", function () {
        api("/users/" + encodeURIComponent(sel.dataset.user) + "/role", {
          method: "PUT",
          body: { role: sel.value },
        })
          .then(function (data) {
            toast(data.message || "Role updated.");
          })
          .catch(function (err) { toast(err.message, "err"); });
      });
    });

    $$('[data-act="deluser"]', tbody).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!window.confirm("Remove this borrower?")) return;
        api("/users/" + encodeURIComponent(btn.dataset.id), { method: "DELETE" })
          .then(function (data) {
            toast(data.message || "User removed.");
            loadAdmin();
          })
          .catch(function (err) { toast(err.message, "err"); });
      });
    });
  }

  function createBook(e) {
    e.preventDefault();
    var form = e.target;
    var body = {
      title: form.title.value.trim(),
      author: form.author.value.trim(),
      isbn: form.isbn.value.trim(),
      category: form.category.value.trim(),
      quantity: Number(form.quantity.value),
    };
    api("/books", { method: "POST", body: body })
      .then(function (data) {
        toast(data.message || "Book added to the stacks.");
        form.reset();
        form.quantity.value = 1;
        loadCatalog();
      })
      .catch(function (err) { toast(err.message, "err"); });
  }

  /* ---------- boot ---------- */

  function fetchProfile() {
    return api("/auth/profile")
      .then(function (data) { return data.user; })
      .catch(function (err) {
        if (err.status === 401) {
          leaveApp();
          toast("Session expired — sign in again.", "err");
        }
        throw err;
      });
  }

  function boot() {
    if (!state.token) {
      showGate();
      return;
    }
    fetchProfile()
      .then(function (user) { enterApp(user); checkTab("catalog"); })
      .catch(function () { /* handled */ });
  }

  /* ---------- events ---------- */

  $$(".gate-tab").forEach(function (btn) {
    btn.addEventListener("click", function () { setGateMode(btn.dataset.mode); });
  });

  $("#auth-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.target;
    var isRegister = !$('input[name="name"]').classList.contains("hidden");
    setGateError("");
    var payload = {
      email: form.email.value.trim(),
      password: form.password.value,
    };
    if (isRegister) {
      payload.name = form.name.value.trim();
      payload.role = form.role.value;
    }
    var path = isRegister ? "/auth/register" : "/auth/login";

    api(path, { method: "POST", body: payload })
      .then(function (data) {
        state.token = data.token;
        localStorage.setItem("lm_token", data.token);
        enterApp(data.user);
        checkTab("catalog");
        toast("Welcome, " + (data.user.name || "reader") + ".");
      })
      .catch(function (err) {
        setGateError(err.message);
      });
  });

  $("#btn-logout").addEventListener("click", function () {
    leaveApp();
    toast("Logged out. The stacks await your return.");
  });

  $$(".tab-item").forEach(function (tab) {
    tab.addEventListener("click", function () { checkTab(tab.dataset.view); });
  });

  $("#book-form").addEventListener("submit", createBook);

  var searchTimer = null;
  $("#search-input").addEventListener("input", function (e) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.search = e.target.value;
      loadCatalog();
    }, 220);
  });

  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.filter = chip.dataset.status;
      $$(".chip").forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
      });
      loadCatalog();
    });
  });

  document.fonts && document.fonts.ready.then(function () {
    document.body.classList.add("fonts-ready");
  });

  boot();
})();