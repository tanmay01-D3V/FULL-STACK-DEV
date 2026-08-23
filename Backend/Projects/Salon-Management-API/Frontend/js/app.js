let allServices = [];
let editingServiceId = null;
let servicesLoaded = false;

const $ = (sel) => document.querySelector(sel);

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("auth:expired", handleSessionExpired);

function init() {
  bindNav();
  bindAuthForms();
  bindServiceModal();
  bindManageActions();
  updateAuthUI();
  loadServices();
}

function bindNav() {
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showView(el.dataset.nav);
    });
  });

  $("#btn-open-login").addEventListener("click", () => {
    switchAuthTab("login");
    showView("auth");
  });

  $("#btn-logout").addEventListener("click", () => {
    clearSession();
    updateAuthUI();
    showView("services");
    toast("You have been logged out.", "info");
  });

  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = $(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function showView(name) {
  if (name === "manage" && !isLoggedIn()) name = "auth";
  const allowed = ["services", "auth", "manage"];
  if (!allowed.includes(name)) name = "services";

  ["services", "auth", "manage"].forEach((v) => {
    $(`#view-${v}`).hidden = v !== name;
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === name);
  });

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function updateAuthUI() {
  const logged = isLoggedIn();
  const user = getUser();

  $("#nav-manage").hidden = !logged;
  $("#user-chip").hidden = !logged;
  $("#btn-open-login").hidden = logged;
  $("#btn-logout").hidden = !logged;

  if (logged && user) {
    $("#user-name").textContent = user.name || user.email;
    $("#user-avatar").textContent = (user.name || user.email).charAt(0);
    $("#user-role").textContent = user.role || "customer";
  }

  renderServicesGrid();
}

function handleSessionExpired() {
  clearSession();
  updateAuthUI();
  showView("auth");
  toast("Your session has expired. Please log in again.", "error");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );
}

function formatPrice(price) {
  const n = Number(price);
  return `$${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
}

const SPARKLE_SVG =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/></svg>';

const CLOCK_SVG =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';

async function loadServices() {
  const grid = $("#services-grid");
  grid.innerHTML =
    '<div class="state"><div class="spinner"></div>Loading services...</div>';

  try {
    const res = await ServicesAPI.getAll();
    allServices = Array.isArray(res.data) ? res.data : [];
    servicesLoaded = true;
    renderServicesGrid();
    renderManageTable();
  } catch (err) {
    grid.innerHTML = `
      <div class="state">
        <p>${escapeHtml(err.message)}</p>
        <button type="button" class="btn btn-primary btn-sm" id="retry-load">Try Again</button>
      </div>`;
    const retry = $("#retry-load");
    if (retry) retry.addEventListener("click", loadServices);
    $("#manage-tbody").innerHTML = "";
  }
}

function getFilteredServices() {
  const q = $("#service-search").value.trim().toLowerCase();
  if (!q) return allServices;
  return allServices.filter(
    (s) =>
      s.name?.toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q)
  );
}

function renderServicesGrid() {
  const grid = $("#services-grid");
  if (!grid || !servicesLoaded) return;

  const list = getFilteredServices();

  if (allServices.length === 0) {
    grid.innerHTML =
      '<div class="state"><p>No services available right now. Check back soon!</p></div>';
    return;
  }

  if (list.length === 0) {
    grid.innerHTML =
      '<div class="state"><p>No services match your search.</p></div>';
    return;
  }

  grid.innerHTML = list
    .map(
      (s) => `
      <article class="card">
        <div class="card-icon">${SPARKLE_SVG}</div>
        <h3>${escapeHtml(s.name)}</h3>
        ${s.description ? `<p class="card-desc">${escapeHtml(s.description)}</p>` : ""}
        <div class="card-meta">
          <span class="price">${formatPrice(s.price)}</span>
          ${s.duration_minutes ? `<span class="duration">${CLOCK_SVG}${Number(s.duration_minutes)} min</span>` : ""}
        </div>
      </article>`
    )
    .join("");
}

function findService(id) {
  return allServices.find((s) => String(s.id) === String(id));
}

function renderManageTable() {
  const tbody = $("#manage-tbody");
  if (!tbody) return;

  if (!isLoggedIn()) {
    tbody.innerHTML = "";
    return;
  }

  if (allServices.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:40px">No services yet. Click "+ Add Service" to create your first one.</td></tr>';
    return;
  }

  tbody.innerHTML = allServices
    .map(
      (s) => `
      <tr data-id="${escapeHtml(s.id)}">
        <td class="cell-name">${escapeHtml(s.name)}</td>
        <td class="cell-desc">${s.description ? escapeHtml(s.description) : "—"}</td>
        <td class="cell-price">${formatPrice(s.price)}</td>
        <td>${s.duration_minutes ? `${Number(s.duration_minutes)} min` : "—"}</td>
        <td class="actions-col">
          <span class="actions-cell">
            <button type="button" class="btn btn-ghost btn-sm" data-edit="${escapeHtml(s.id)}">Edit</button>
            <button type="button" class="btn btn-danger btn-sm" data-delete="${escapeHtml(s.id)}">Delete</button>
          </span>
        </td>
      </tr>`
    )
    .join("");
}

function bindManageActions() {
  $("#btn-add-service").addEventListener("click", () => openServiceModal(null));

  $("#service-search").addEventListener("input", renderServicesGrid);

  $("#manage-tbody").addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) {
      openServiceModal(findService(editBtn.dataset.edit));
      return;
    }
    const deleteBtn = e.target.closest("[data-delete]");
    if (deleteBtn) handleDeleteService(deleteBtn.dataset.delete);
  });
}

function openServiceModal(service) {
  editingServiceId = service ? service.id : null;

  $("#service-modal-title").textContent = service ? "Edit Service" : "Add Service";
  $("#service-submit").textContent = service ? "Save Changes" : "Create Service";
  hideFormError($("#service-error"));

  $("#service-form").reset();
  if (service) {
    $("#service-name").value = service.name ?? "";
    $("#service-price").value = service.price ?? "";
    $("#service-duration").value = service.duration_minutes ?? "";
    $("#service-description").value = service.description ?? "";
  }

  $("#service-modal").hidden = false;
  $("#service-name").focus();
}

function closeServiceModal() {
  $("#service-modal").hidden = true;
  editingServiceId = null;
}

function bindServiceModal() {
  $("#modal-close").addEventListener("click", closeServiceModal);
  $("#modal-cancel").addEventListener("click", closeServiceModal);

  $("#service-modal").addEventListener("mousedown", (e) => {
    if (e.target === e.currentTarget) closeServiceModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#service-modal").hidden) closeServiceModal();
  });

  $("#service-form").addEventListener("submit", handleServiceSubmit);
}

function showFormError(el, message) {
  el.textContent = message;
  el.hidden = false;
}

function hideFormError(el) {
  el.hidden = true;
  el.textContent = "";
}

async function handleServiceSubmit(e) {
  e.preventDefault();

  const errorEl = $("#service-error");
  hideFormError(errorEl);

  const name = $("#service-name").value.trim();
  const priceRaw = $("#service-price").value.trim();
  const durationRaw = $("#service-duration").value.trim();
  const description = $("#service-description").value.trim();

  if (!name) return showFormError(errorEl, "Name is required.");
  if (priceRaw === "") return showFormError(errorEl, "Price is required.");

  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) {
    return showFormError(errorEl, "Price must be a number of 0 or more.");
  }

  let duration_minutes;
  if (durationRaw !== "") {
    duration_minutes = Number(durationRaw);
    if (!Number.isInteger(duration_minutes) || duration_minutes <= 0) {
      return showFormError(errorEl, "Duration must be a whole number greater than 0.");
    }
  }

  const payload = { name, price };
  if (description) payload.description = description;
  if (duration_minutes !== undefined) payload.duration_minutes = duration_minutes;

  const submitBtn = $("#service-submit");
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    if (editingServiceId) {
      await ServicesAPI.update(editingServiceId, payload);
      toast(`"${name}" was updated.`, "success");
    } else {
      await ServicesAPI.create(payload);
      toast(`"${name}" was added to the menu.`, "success");
    }
    closeServiceModal();
    await loadServices();
  } catch (err) {
    showFormError(errorEl, err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
}

async function handleDeleteService(id) {
  const service = findService(id);
  if (!service) return;

  if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) return;

  try {
    await ServicesAPI.remove(id);
    toast(`"${service.name}" was deleted.`, "info");
    await loadServices();
  } catch (err) {
    toast(err.message, "error");
  }
}

function switchAuthTab(tabName) {
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === tabName);
  });
  $("#login-form").hidden = tabName !== "login";
  $("#signup-form").hidden = tabName !== "signup";
  $("#auth-title").textContent = tabName === "login" ? "Welcome back" : "Join Luxe Salon";
  hideFormError($("#login-error"));
  hideFormError($("#signup-error"));
}

function bindAuthForms() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
  });

  $("#login-form").addEventListener("submit", handleLogin);
  $("#signup-form").addEventListener("submit", handleSignup);
}

async function handleLogin(e) {
  e.preventDefault();
  const errorEl = $("#login-error");
  hideFormError(errorEl);

  const email = $("#login-email").value.trim().toLowerCase();
  const password = $("#login-password").value;

  if (!email || !password) return showFormError(errorEl, "Email and password are required.");

  await runAuth(
    AuthAPI.login(email, password),
    errorEl,
    "#login-submit",
    "#login-form",
    "Logging in..."
  );
}

async function handleSignup(e) {
  e.preventDefault();
  const errorEl = $("#signup-error");
  hideFormError(errorEl);

  const name = $("#signup-name").value.trim();
  const email = $("#signup-email").value.trim().toLowerCase();
  const password = $("#signup-password").value;

  if (!name || !email || !password) return showFormError(errorEl, "All fields are required.");
  if (password.length < 6) return showFormError(errorEl, "Password must be at least 6 characters.");

  await runAuth(
    AuthAPI.signup(name, email, password),
    errorEl,
    "#signup-submit",
    "#signup-form",
    "Creating account..."
  );
}

async function runAuth(promise, errorEl, btnSel, formSel, pendingText) {
  const btn = $(btnSel);
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = pendingText;

  try {
    const res = await promise;
    saveSession(res.token, res.user);
    $(formSel).reset();
    updateAuthUI();
    const firstName = (res.user?.name || "").split(" ")[0] || res.user?.email;
    toast(`Welcome${firstName ? `, ${firstName}` : ""}! You are now logged in.`, "success");
    showView("manage");
    renderManageTable();
  } catch (err) {
    showFormError(errorEl, err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}

function toast(message, type = "info") {
  const container = $("#toast-container");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);

  setTimeout(() => {
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 350);
  }, 3200);
}
