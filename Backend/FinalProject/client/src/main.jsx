import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import {
  CalendarDays,
  Check,
  Clock3,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import "./styles.css";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5004/api",
});
const formatDate = (value) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
const formatTime = (value) =>
  new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(
    new Date(value),
  );
const toInput = (value) => {
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem("interviewlyToken", data.token);
      onAuth(data.user);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to connect to the API");
    }
  };
  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <div className="brand-mark">
          <CalendarDays size={20} />
        </div>
        <p className="eyebrow">INTERVIEWLY</p>
        <h1>Good interviews start with a clear calendar.</h1>
        <p className="muted">
          A calm place for recruiters to publish time and candidates to claim
          it.
        </p>
        <div className="trust">
          <ShieldCheck size={18} />
          <span>Protected scheduling with conflict checks</span>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Create account
          </button>
        </div>
        <h2>{mode === "login" ? "Welcome back" : "Set up your account"}</h2>
        <p className="muted">
          {mode === "login"
            ? "Enter your details to continue."
            : "Choose the workspace that fits your role."}
        </p>
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Morgan"
              />
            </label>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="alex@company.com"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </label>
          {mode === "register" && (
            <label>
              Account type
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </label>
          )}
          {error && <div className="error">{error}</div>}
          <button className="primary wide" type="submit">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

function SlotCard({ slot, onBook, canBook }) {
  const booked = slot.status === "BOOKED";
  return (
    <article className="slot-card">
      <div className="slot-top">
        <span className={`status ${booked ? "booked" : "available"}`}>
          {booked ? "Booked" : "Available"}
        </span>
        <span className="duration">
          <Clock3 size={14} />{" "}
          {Math.round(
            (new Date(slot.endTime) - new Date(slot.startTime)) / 60000,
          )}{" "}
          min
        </span>
      </div>
      <h3>{slot.title || "Interview"}</h3>
      <p className="slot-date">{formatDate(slot.startTime)}</p>
      <p className="slot-time">
        {formatTime(slot.startTime)} <span>to</span> {formatTime(slot.endTime)}
      </p>
      <div className="slot-footer">
        <span className="recruiter">
          with {slot.recruiter?.name || "Recruiter"}
        </span>
        {canBook && (
          <button
            className="outline"
            disabled={booked}
            onClick={() => onBook(slot._id)}
          >
            {booked ? "Unavailable" : "Book slot"}
          </button>
        )}
      </div>
    </article>
  );
}

function Dashboard({ user, onLogout }) {
  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("interviewlyToken")}`,
    },
  };
  const load = async () => {
    try {
      const [a, m] = await Promise.all([
        api.get("/slots"),
        api.get("/slots/mine", auth),
      ]);
      setAvailable(a.data.slots);
      setMine(m.data.slots);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load slots");
    }
  };
  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(
    () =>
      available.filter((s) =>
        `${s.title} ${s.recruiter?.name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [available, query],
  );
  const book = async (id) => {
    setError("");
    setNotice("");
    try {
      await api.post(`/slots/${id}/book`, {}, auth);
      setNotice("Your interview is booked. It is now in My schedule.");
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not book this slot");
    }
  };
  const saveSlot = async (payload) => {
    try {
      if (editing) await api.patch(`/slots/${editing._id}`, payload, auth);
      else await api.post("/slots", payload, auth);
      setShowForm(false);
      setEditing(null);
      setNotice(editing ? "Slot updated." : "Slot published.");
      load();
    } catch (e) {
      throw new Error(e.response?.data?.message || "Could not save slot");
    }
  };
  const cancel = async (id) => {
    try {
      await api.delete(`/slots/${id}`, auth);
      setNotice("Slot cancelled.");
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not cancel slot");
    }
  };
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#">
          <span className="brand-mark">
            <CalendarDays size={18} />
          </span>{" "}
          interviewly
        </a>
        <div className="top-actions">
          <span className="user-chip">
            <UserRound size={16} /> {user.name}
            <small>{user.role}</small>
          </span>
          <button className="icon-btn" title="Sign out" onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              {user.role === "recruiter"
                ? "RECRUITER WORKSPACE"
                : "CANDIDATE WORKSPACE"}
            </p>
            <h1>
              {user.role === "recruiter"
                ? "Shape the next conversation."
                : "Find a time that works."}
            </h1>
            <p className="muted">
              {user.role === "recruiter"
                ? "Publish clear availability and keep every interview in rhythm."
                : "Browse available interviews and reserve the conversation that fits."}
            </p>
          </div>
          {user.role === "recruiter" && (
            <button
              className="primary"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              <Plus size={17} /> Publish slot
            </button>
          )}
        </div>
        {notice && (
          <div className="notice">
            <Check size={17} /> {notice}
          </div>
        )}
        {error && (
          <div className="error global">
            <X size={17} /> {error}
          </div>
        )}
        <section className="summary">
          <div>
            <span>Available slots</span>
            <strong>{available.length}</strong>
          </div>
          <div>
            <span>My schedule</span>
            <strong>{mine.length}</strong>
          </div>
          <div>
            <span>Account</span>
            <strong className="capitalize">{user.role}</strong>
          </div>
        </section>
        {user.role === "candidate" ? (
          <>
            <div className="section-heading">
              <div>
                <h2>Open interviews</h2>
                <p className="muted">
                  Select a slot to reserve it. Times are shown in your local
                  timezone.
                </p>
              </div>
              <label className="search">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search interviews"
                />
              </label>
            </div>
            <div className="slot-grid">
              {filtered.length ? (
                filtered.map((slot) => (
                  <SlotCard key={slot._id} slot={slot} onBook={book} canBook />
                ))
              ) : (
                <Empty
                  title="No open slots yet"
                  copy="Recruiters will appear here as they publish availability."
                />
              )}
            </div>
          </>
        ) : (
          <RecruiterView
            slots={mine}
            onEdit={(slot) => {
              setEditing(slot);
              setShowForm(true);
            }}
            onCancel={cancel}
          />
        )}
        {user.role === "candidate" && (
          <>
            <div className="section-heading schedule-heading">
              <div>
                <h2>My schedule</h2>
                <p className="muted">Your confirmed conversations.</p>
              </div>
            </div>
            <div className="slot-grid">
              {mine.length ? (
                mine.map((slot) => <SlotCard key={slot._id} slot={slot} />)
              ) : (
                <Empty
                  title="Your calendar is clear"
                  copy="Book an available interview to see it here."
                />
              )}
            </div>
          </>
        )}
      </main>
      {showForm && (
        <SlotForm
          initial={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={saveSlot}
        />
      )}
    </div>
  );
}

function RecruiterView({ slots, onEdit, onCancel }) {
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Published slots</h2>
          <p className="muted">Manage your available interview windows.</p>
        </div>
      </div>
      <div className="slot-grid">
        {slots.length ? (
          slots.map((slot) => (
            <article className="slot-card" key={slot._id}>
              <div className="slot-top">
                <span
                  className={`status ${slot.status === "BOOKED" ? "booked" : "available"}`}
                >
                  {slot.status}
                </span>
                <span className="duration">
                  <Clock3 size={14} />{" "}
                  {Math.round(
                    (new Date(slot.endTime) - new Date(slot.startTime)) / 60000,
                  )}{" "}
                  min
                </span>
              </div>
              <h3>{slot.title}</h3>
              <p className="slot-date">{formatDate(slot.startTime)}</p>
              <p className="slot-time">
                {formatTime(slot.startTime)} <span>to</span>{" "}
                {formatTime(slot.endTime)}
              </p>
              {slot.candidate && (
                <p className="candidate-line">
                  <UserRound size={14} /> {slot.candidate.name}
                </p>
              )}
              <div className="slot-footer">
                {slot.status === "AVAILABLE" ? (
                  <>
                    <button className="text-btn" onClick={() => onEdit(slot)}>
                      Edit
                    </button>
                    <button
                      className="danger-btn"
                      title="Cancel slot"
                      onClick={() => onCancel(slot._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <span className="muted">Confirmed interview</span>
                )}
              </div>
            </article>
          ))
        ) : (
          <Empty
            title="No slots published"
            copy="Create your first interview window to get started."
          />
        )}
      </div>
    </>
  );
}
function Empty({ title, copy }) {
  return (
    <div className="empty">
      <CalendarDays size={22} />
      <h3>{title}</h3>
      <p className="muted">{copy}</p>
    </div>
  );
}
function SlotForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    title: initial?.title || "Interview",
    startTime: initial ? toInput(initial.startTime) : "",
    endTime: initial ? toInput(initial.endTime) : "",
    meetingLink: initial?.meetingLink || "",
  });
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSave({
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="modal-backdrop">
      <section className="modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{initial ? "EDIT SLOT" : "NEW SLOT"}</p>
            <h2>{initial ? "Update availability" : "Publish availability"}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        <form onSubmit={submit}>
          <label>
            Interview title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <div className="form-row">
            <label>
              Starts
              <input
                required
                type="datetime-local"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </label>
            <label>
              Ends
              <input
                required
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </label>
          </div>
          <label>
            Meeting link <span className="muted">(optional)</span>
            <input
              type="url"
              value={form.meetingLink}
              onChange={(e) =>
                setForm({ ...form, meetingLink: e.target.value })
              }
              placeholder="https://meet.google.com/..."
            />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="text-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="primary" type="submit">
              {initial ? "Save changes" : "Publish slot"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("interviewlyToken");
    if (!token) return setLoading(false);
    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem("interviewlyToken"))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="loading">Loading workspace...</div>;
  if (!user) return <Auth onAuth={setUser} />;
  return (
    <Dashboard
      user={user}
      onLogout={() => {
        localStorage.removeItem("interviewlyToken");
        setUser(null);
      }}
    />
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
