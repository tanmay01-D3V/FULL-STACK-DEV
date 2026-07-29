const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
    next();
};

app.use(requestLogger);

let colleges = [];

app.get("/college", (req, res) => {
  try {
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/college/:id", (req, res) => {
  try {
    const id = req.params.id;
    const found = colleges.find((c) => c.id == id);
    if (!found) {
      return res.status(404).json({ message: "College not found" });
    }
    res.status(200).json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/college", (req, res) => {
  try {
    const newCollege = {
      id: colleges.length + 1,
      name: req.body.name,
      location: req.body.location,
      courses: req.body.courses,
    };
    colleges.push(newCollege);
    res
      .status(201)
      .json({ message: "College added successfully", college: newCollege });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/college/:id", (req, res) => {
  try {
    const id = req.params.id;
    const index = colleges.findIndex((c) => c.id == id);
    if (index === -1) {
      return res.status(404).json({ message: "College not found" });
    }
    const updated = {
      ...colleges[index],
      name: req.body.name ?? colleges[index].name,
      location: req.body.location ?? colleges[index].location,
      courses: req.body.courses ?? colleges[index].courses,
    };
    colleges[index] = updated;
    res
      .status(200)
      .json({ message: "College updated successfully", college: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/college/:id", (req, res) => {
  try {
    const id = req.params.id;
    const collegeIndex = colleges.findIndex((c) => c.id == id);
    if (collegeIndex === -1) {
      return res.status(404).json({ message: "College not found" });
    }
    colleges.splice(collegeIndex, 1);
    res.status(200).json({ message: "College deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
