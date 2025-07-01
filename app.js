const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "contact_app",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }
  console.log("Connected to MariaDB database");
});

// Create tables if they don't exist
const createTables = () => {
  // Users table
  const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

  // Contacts table
  const createContactsTable = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            nama VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            nomor_telepon VARCHAR(20) NOT NULL,
            alamat TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `;

  db.query(createUsersTable, (err) => {
    if (err) console.log("Error creating users table:", err);
    else console.log("Users table ready");
  });

  db.query(createContactsTable, (err) => {
    if (err) console.log("Error creating contacts table:", err);
    else console.log("Contacts table ready");
  });
};

createTables();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Routes
app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

// Login page
app.get("/login", (req, res) => {
  if (req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.render("login", { error: null });
  }
});

// Login process
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.render("login", { error: "Terjadi error pada server" });
      }

      if (results.length === 0) {
        return res.render("login", { error: "Username atau password salah" });
      }

      const user = results[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.render("login", { error: "Username atau password salah" });
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect("/dashboard");
    }
  );
});

// Register page
app.get("/register", (req, res) => {
  if (req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.render("register", { error: null, success: null });
  }
});

// Register process
app.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render("register", {
      error: "Password tidak cocok",
      success: null,
    });
  }

  if (password.length < 6) {
    return res.render("register", {
      error: "Password minimal 6 karakter",
      success: null,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.render("register", {
              error: "Username sudah terdaftar",
              success: null,
            });
          }
          console.log(err);
          return res.render("register", {
            error: "Terjadi error pada server",
            success: null,
          });
        }

        res.render("register", {
          error: null,
          success: "Registrasi berhasil! Silakan login.",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.render("register", {
      error: "Terjadi error pada server",
      success: null,
    });
  }
});

// Dashboard
app.get("/dashboard", requireAuth, (req, res) => {
  const userId = req.session.userId;

  db.query(
    "SELECT COUNT(*) as total FROM contacts WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.render("dashboard", {
          username: req.session.username,
          totalContacts: 0,
        });
      }

      const totalContacts = results[0].total;
      res.render("dashboard", {
        username: req.session.username,
        totalContacts,
      });
    }
  );
});

// Contact list
app.get("/contacts", requireAuth, (req, res) => {
  const userId = req.session.userId;

  db.query(
    "SELECT * FROM contacts WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.render("contacts", {
          contacts: [],
          username: req.session.username,
        });
      }

      res.render("contacts", {
        contacts: results,
        username: req.session.username,
      });
    }
  );
});

// Add contact page
app.get("/add-contact", requireAuth, (req, res) => {
  res.render("add-contact", {
    username: req.session.username,
    error: null,
    success: null,
  });
});

// Add contact process
app.post("/add-contact", requireAuth, (req, res) => {
  const { nama, email, nomor_telepon, alamat } = req.body;
  const userId = req.session.userId;

  if (!nama || !email || !nomor_telepon || !alamat) {
    return res.render("add-contact", {
      username: req.session.username,
      error: "Semua field harus diisi",
      success: null,
    });
  }

  db.query(
    "INSERT INTO contacts (user_id, nama, email, nomor_telepon, alamat) VALUES (?, ?, ?, ?, ?)",
    [userId, nama, email, nomor_telepon, alamat],
    (err) => {
      if (err) {
        console.log(err);
        return res.render("add-contact", {
          username: req.session.username,
          error: "Terjadi error saat menyimpan kontak",
          success: null,
        });
      }

      res.render("add-contact", {
        username: req.session.username,
        error: null,
        success: "Kontak berhasil ditambahkan!",
      });
    }
  );
});

// Delete contact
app.post("/delete-contact/:id", requireAuth, (req, res) => {
  const contactId = req.params.id;
  const userId = req.session.userId;

  db.query(
    "DELETE FROM contacts WHERE id = ? AND user_id = ?",
    [contactId, userId],
    (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/contacts");
    }
  );
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
