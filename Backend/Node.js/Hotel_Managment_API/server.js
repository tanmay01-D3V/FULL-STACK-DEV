const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
};

app.use(requestLogger);

let hotels = [];
let users = [];

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/hotels", (req, res) => {
  try {
    const newHotels = {
      id: hotels.length + 1,
      name: req.body.name,
      location: req.body.location,
      rating: req.body.rating,
      pricePerNight: req.body.pricePerNight,
    };
    hotels.push(newHotels);
    res
      .status(201)
      .json({ message: "Hotel added successfully", hotels: newHotels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

app.get("/Hotels", (req, res) => {
  try {
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/hotels/:id", (req, res) => {
  try {
    const id = req.params.id;
    const found = hotels.find((c) => c.id == id);
    if (!found) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/hotels/:id", (req, res) => {
  try {
    const id = req.params.id;
    const index = hotels.findIndex((c) => c.id == id);
    if (index === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const updated = {
      ...hotels[index],
      name: req.body.name ?? hotels[index].name,
      location: req.body.location ?? hotels[index].location,
      rating: req.body.rating ?? hotels[index].rating,
      pricePerNight: req.body.pricePerNight ?? hotels[index].pricePerNight,
    };
    hotels[index] = updated;
    res
      .status(200)
      .json({ message: "Hotel updated successfully", hotels: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/hotels/:id", (req, res) => {
  try {
    const id = req.params.id;
    const hotelsIndex = hotels.findIndex((c) => c.id == id);
    if (hotelsIndex === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    hotels.splice(hotelsIndex, 1);
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
