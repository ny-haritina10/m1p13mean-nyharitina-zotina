const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        const seedAdmin = require("./seeders/userSeeder");
        const seedMenus = require("./seeders/menuSeeder");
        seedAdmin();
        seedMenus();
    })
    .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/seller", require("./routes/seller.routes"));
app.use("/api/menu", require("./routes/menu.routes"));

app.get("/", (req, res) => {
    res.json({ message: "API is working 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));