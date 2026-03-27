const express = require('express');
const path = require('path');
const multer = require('multer'); 
const fs = require('fs'); 
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const bcrypt = require('bcryptjs');


const app = express();
app.disable('x-powered-by');
const PORT = 0;


app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      scriptSrcElem: ["'self'"],
      scriptSrcAttr: ["'none'"],
      connectSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// Allow maximum 5000 requests per 15 minutes per IP 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5000, 
    message: "Too many requests, please try again later."
});

app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

const crypto = require('crypto');
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
}));


function requireLogin(req, res, next) {
    let userId = req.session && req.session.userId;
    if (!userId) userId = 0; // Fallback to default account
    req.userId = userId;
    next();
}



// Determine Storage Directory (Safe for Electron read-only packages)
let storageDir = __dirname;
if (process.versions && process.versions.electron) {
    const { app } = require('electron');
    storageDir = app.getPath('userData');
}

// Setup Database
const dbPath = require('path').join(storageDir, 'meme_creator.db');
const db = new sqlite3.Database(dbPath);


db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar_path TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.all(`PRAGMA table_info(users)`, (err, cols) => {
    if (err || !cols) return;
    const has = cols.some(c => c.name === 'avatar_path');
    if (!has) db.run(`ALTER TABLE users ADD COLUMN avatar_path TEXT DEFAULT ''`);
    
    const hasBio = cols.some(c => c.name === 'bio');
    if (!hasBio) db.run(`ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''`);

    const hasLinks = cols.some(c => c.name === 'links');
    if (!hasLinks) db.run(`ALTER TABLE users ADD COLUMN links TEXT DEFAULT '[]'`);
});


    db.run(`CREATE TABLE IF NOT EXISTS user_prefs (
        user_id INTEGER PRIMARY KEY,
        binder_zoom INTEGER DEFAULT 250,
        template_zoom INTEGER DEFAULT 250,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);


        db.run(`CREATE TABLE IF NOT EXISTS saved_memes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 0,
        name TEXT,
        keywords TEXT,
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS saved_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 0,
        name TEXT,
        keywords TEXT,
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS saved_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 0,
        name TEXT,
        thumb_path TEXT,
        state_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);


    
        // Categories Table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 0,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Add user_id column for existing installs + migrate where possible
    db.all(`PRAGMA table_info(categories)`, (err, rows) => {
        if (err || !rows) return;
        if (!rows.some(r => r.name === 'user_id')) {
            db.run(`ALTER TABLE categories ADD COLUMN user_id INTEGER DEFAULT 0`, () => {
                db.run(`
                    UPDATE categories
                    SET user_id = (
                        SELECT user_id FROM saved_memes
                        WHERE category_id = categories.id AND user_id != 0
                        LIMIT 1
                    )
                    WHERE user_id = 0 AND type = 'binder'
                `);
                db.run(`
                    UPDATE categories
                    SET user_id = (
                        SELECT user_id FROM saved_templates
                        WHERE category_id = categories.id AND user_id != 0
                        LIMIT 1
                    )
                    WHERE user_id = 0 AND type = 'templates'
                `);
            });
        }
    });


    const addCatCol = (tbl, colName = 'category_id', type = 'INTEGER DEFAULT 0') => {
        db.all(`PRAGMA table_info(${tbl})`, (err, rows) => {
            if (err || !rows || rows.length === 0) return;
            if (!rows.some(r => r.name === colName)) {
                db.run(`ALTER TABLE ${tbl} ADD COLUMN ${colName} ${type}`);
            }
        });
    };
            addCatCol('saved_memes');
    addCatCol('saved_templates');
    addCatCol('saved_progress');

    // Ownership (required for security)
addCatCol('saved_memes', 'user_id', "INTEGER DEFAULT 0");
addCatCol('saved_templates', 'user_id', "INTEGER DEFAULT 0");
addCatCol('saved_progress', 'user_id', "INTEGER DEFAULT 0");

addCatCol('saved_progress', 'keywords', "TEXT DEFAULT ''");
addCatCol('saved_progress', 'thumb_path', "TEXT DEFAULT ''");
addCatCol('saved_progress', 'created_at', "DATETIME DEFAULT CURRENT_TIMESTAMP");
addCatCol('saved_progress', 'updated_at', "DATETIME DEFAULT CURRENT_TIMESTAMP");

addCatCol('timeline_posts', 'category', "TEXT DEFAULT 'general'");

    addCatCol('timeline_posts', 'keywords', "TEXT DEFAULT ''");
    addCatCol('timeline_posts', 'original_post_id', "INTEGER");
addCatCol('timeline_posts', 'original_user_id', "INTEGER");
addCatCol('timeline_posts', 'reposted_from_post_id', "INTEGER");
addCatCol('timeline_posts', 'is_pinned', "INTEGER DEFAULT 0");
addCatCol('timeline_posts', 'is_nsfw', "INTEGER DEFAULT 0");



    db.all(`PRAGMA table_info(user_prefs)`, (err, rows) => {
        if (err || !rows) return;
        if (!rows.some(r => r.name === 'timeline_excludes')) {
            db.run(`ALTER TABLE user_prefs ADD COLUMN timeline_excludes TEXT DEFAULT ''`);
        }
        if (!rows.some(r => r.name === 'banned_keywords')) {
            db.run(`ALTER TABLE user_prefs ADD COLUMN banned_keywords TEXT DEFAULT ''`);
        }
    });
});


// Setup upload storage (ensure folder exists)
const uploadsDir = path.join(storageDir, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
    dest: uploadsDir,
        limits: { fileSize: 100 * 1024 * 1024, fieldSize: 200 * 1024 * 1024 }, 
 
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!')); 
        }
    }
});

// Security Fix: Validate Magic Bytes (File Signature)
const _origSingle = upload.single.bind(upload);
upload.single = (field) => {
    return [
        _origSingle(field),
        async (req, res, next) => {
            if (!req.file) return next();
            try {
                const stream = fs.createReadStream(req.file.path, { start: 0, end: 11 });
                const chunks = [];
                for await (const chunk of stream) chunks.push(chunk);
                stream.destroy();
                
                const buffer = Buffer.concat(chunks);
                const h = buffer.toString('hex').toUpperCase();

                const isValid = h.startsWith('FFD8FF') || h.startsWith('89504E47') || h.startsWith('47494638') || 
                              (h.startsWith('52494646') && buffer.subarray(8, 12).toString('ascii') === 'WEBP');

                if (!isValid) {
                    fs.unlink(req.file.path, () => {}); 
                    return res.status(400).json({ success: false, error: 'Security Block: Invalid file signature.' });
                }
                next();
            } catch (err) { 
                fs.unlink(req.file.path, () => {});
                next(err); 
            }
        }
    ];
};



const publicDir = fs.existsSync(path.join(__dirname, 'public'))
    ? path.join(__dirname, 'public')
    : __dirname;

app.use(express.static(publicDir));

app.use('/uploads', express.static(uploadsDir));

app.get('/api/app-version', (req, res) => {
    let version = '1.0.0';
    if (process.versions && process.versions.electron) {
        const { app } = require('electron');
        version = app.getVersion();
    }
    res.json({ version });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});


function normalizeEmail(v) {
    return String(v || '').trim().toLowerCase();
}

app.get('/api/auth/me', (req, res) => {
    const userId = req.session && req.session.userId;
    if (!userId) return res.status(401).json({ success: false });

    db.get('SELECT id, name, email, avatar_path FROM users WHERE id = ?', [userId], (err, row) => {
        if (err || !row) return res.status(401).json({ success: false });
        res.json({ success: true, user: row });
    });
});


app.post('/api/auth/signup', (req, res) => {
    const name = String(req.body.name || '').trim().substring(0, 40);
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    db.get('SELECT id, name, email FROM users WHERE email = ? OR lower(name) = lower(?)', [email, name], async (err, existing) => {
        if (err) return res.status(500).json({ success: false, error: 'DB error' });
        
        if (existing) {
            if (existing.email === email) {
                return res.status(409).json({ success: false, error: 'Email already in use' });
            }
            return res.status(409).json({ success: false, error: 'Username already taken' });
        }

        try {
            const password_hash = await bcrypt.hash(password, 10);
            db.run(
                'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
                [name, email, password_hash],
                function(insertErr) {
                    if (insertErr) return res.status(500).json({ success: false, error: 'DB error' });
                    req.session.userId = this.lastID;
                    res.json({ success: true, user: { id: this.lastID, name, email } });
                }
            );
        } catch (e) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });
});

app.post('/api/auth/login', (req, res) => {
    const identifier = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!identifier || !password) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    db.get('SELECT id, name, email, password_hash FROM users WHERE email = ? OR lower(name) = ?', [identifier, identifier], async (err, row) => {
        if (err || !row) return res.status(401).json({ success: false, error: 'Invalid email/name or password' });

        const ok = await bcrypt.compare(password, row.password_hash);
        if (!ok) return res.status(401).json({ success: false, error: 'Invalid email or password' });

        req.session.userId = row.id;
        
        return res.json({ success: true, user: { id: row.id, name: row.name, email: row.email } });

    });
});

app.post('/api/auth/logout', (req, res) => {
    if (!req.session) return res.json({ success: true });
    req.session.destroy(() => res.json({ success: true }));
});

app.post('/api/settings', upload.single('avatar'), async (req, res) => {
    const userId = req.session && req.session.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Not logged in' });

    const email = normalizeEmail(req.body.email);
    const oldPass = String(req.body.oldPassword || '');
    const newPass = String(req.body.newPassword || '');

    const avatarPath = req.file ? (`/uploads/${req.file.filename}`) : null;

    db.get('SELECT email, password_hash FROM users WHERE id = ?', [userId], async (err, user) => {
        if (err || !user) return res.status(401).json({ success: false, error: 'Not logged in' });

        try {
            let newHash = null;

            if (newPass) {
                if (!oldPass) return res.status(400).json({ success: false, error: 'Current password required' });
                const ok = await bcrypt.compare(oldPass, user.password_hash);
                if (!ok) return res.status(400).json({ success: false, error: 'Current password incorrect' });
                if (newPass.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
                newHash = await bcrypt.hash(newPass, 10);
            }

            const proceed = () => {
                const sets = [];
                const params = [];

                if (avatarPath) { sets.push('avatar_path = ?'); params.push(avatarPath); }
                if (email && email !== user.email) { sets.push('email = ?'); params.push(email); }
                if (newHash) { sets.push('password_hash = ?'); params.push(newHash); }

                if (sets.length === 0) return res.json({ success: true });

                params.push(userId);
                db.run(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params, (e2) => {
                    if (e2) return res.status(500).json({ success: false, error: 'Save failed' });
                    res.json({ success: true, avatarPath });
                });
            };

            if (email && email !== user.email) {
                db.get('SELECT id FROM users WHERE email = ? AND id <> ?', [email, userId], (e3, exists) => {
                    if (e3) return res.status(500).json({ success: false, error: 'DB error' });
                    if (exists) return res.status(409).json({ success: false, error: 'Email already in use' });
                    proceed();
                });
            } else {
                proceed();
            }
        } catch (e) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    });
});



// gallery zoom
app.get('/api/prefs/zoom', (req, res) => {
    const userId = req.session && req.session.userId;
    if (!userId) return res.status(401).json({ success: false });

    db.run('INSERT OR IGNORE INTO user_prefs (user_id) VALUES (?)', [userId], (e) => {
        if (e) return res.status(500).json({ success: false });

        db.get(
            'SELECT binder_zoom AS binderZoom, template_zoom AS templateZoom FROM user_prefs WHERE user_id = ?',
            [userId],
            (err, row) => {
                if (err || !row) return res.status(500).json({ success: false });
                res.json({ success: true, binderZoom: row.binderZoom, templateZoom: row.templateZoom });
            }
        );
    });
});

app.post('/api/prefs/zoom', (req, res) => {
    const userId = req.session && req.session.userId;
    if (!userId) return res.status(401).json({ success: false });

    const hasBinder = req.body && req.body.binderZoom != null;
    const hasTemplate = req.body && req.body.templateZoom != null;

    const clamp = (v) => Math.max(100, Math.min(600, Number(v)));

    const binderZoom = hasBinder ? clamp(req.body.binderZoom) : null;
    const templateZoom = hasTemplate ? clamp(req.body.templateZoom) : null;

    db.serialize(() => {
        db.run('INSERT OR IGNORE INTO user_prefs (user_id) VALUES (?)', [userId]);

        if (binderZoom != null && Number.isFinite(binderZoom)) {
            db.run(
                'UPDATE user_prefs SET binder_zoom = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
                [binderZoom, userId]
            );
        }

        if (templateZoom != null && Number.isFinite(templateZoom)) {
            db.run(
                'UPDATE user_prefs SET template_zoom = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
                [templateZoom, userId]
            );
        }

        db.get(
            'SELECT binder_zoom AS binderZoom, template_zoom AS templateZoom FROM user_prefs WHERE user_id = ?',
            [userId],
            (err, row) => {
                if (err || !row) return res.status(500).json({ success: false });
                res.json({ success: true, binderZoom: row.binderZoom, templateZoom: row.templateZoom });
            }
        );
    });
});


// Background Remove API

app.post('/api/utils/remove-bg', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    const inputPath = req.file.path;

    try {
        if (!global.fetch) {
            throw new Error('Node.js 18+ is required for background removal (global.fetch not found). Please update Node.');
        }

        let removeBackground;
        try {
            ({ removeBackground } = require('@imgly/background-removal-node'));
        } catch (e) {
            console.error('Missing @imgly/background-removal-node:', e);
            return res.status(500).json({
                success: false,
                error: 'Library missing. Run: npm install @imgly/background-removal-node'
            });
        }

        const fsp = require('fs').promises;
        const inputBuffer = await fsp.readFile(inputPath);
        
        await fsp.unlink(inputPath).catch(() => {});

        const blob = new Blob([inputBuffer], { type: req.file.mimetype });
        
        const p = require('path');
        const { pathToFileURL } = require('url');
        let distFolder = p.dirname(require.resolve('@imgly/background-removal-node'));
        if (distFolder.includes('app.asar')) {
            distFolder = distFolder.replace('app.asar', 'app.asar.unpacked');
        }
        
        const outBlob = await removeBackground(blob, {
            publicPath: pathToFileURL(distFolder).href + '/'
        });
        
        const outBuffer = Buffer.from(await outBlob.arrayBuffer());

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).send(outBuffer);

    } catch (err) {
        console.error('remove-bg failed:', err);
        const msg = err.message || 'Unknown error';
        return res.status(500).json({ success: false, error: 'Removal failed: ' + msg });
    }
});

// Save to Binder
app.post('/api/memes/binder', requireLogin, upload.single('meme'), (req, res) => {
    const userId = req.userId;
    const name = (req.body.name || '').trim().substring(0, 50);
    const keywords = (req.body.keywords || '').trim().substring(0, 200);

    if (!req.file) return res.status(400).json({ success: false, error: 'No file' });

    const relPath = '/uploads/' + req.file.filename;

    let categories = [0];
    try { if (req.body.categories) categories = JSON.parse(req.body.categories); } catch(e){}
    if (categories.length === 0) categories = [0];

    let count = 0;
    let errOccurred = false;

    categories.forEach(catId => {
        db.run(
            'INSERT INTO saved_memes (user_id, name, keywords, image_path, category_id) VALUES (?, ?, ?, ?, ?)',
            [userId, name, keywords, relPath, Number(catId) || 0],
            function(err) {
                if (err) errOccurred = true;
                count++;
                if (count === categories.length) {
                    if (errOccurred) return res.status(500).json({ success: false });
                    res.json({ success: true, path: relPath });
                }
            }
        );
    });
});

// Load Binder (only my items)
app.get('/api/memes/binder', requireLogin, (req, res) => {
    const userId = req.userId;
    res.setHeader('Cache-Control', 'no-store');
    db.all(
        'SELECT * FROM saved_memes WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, memes: rows });
        }
    );
});

// Delete from Binder (only my item)
app.post('/api/memes/delete', requireLogin, express.json(), (req, res) => {
    const userId = req.userId;
    const id = req.body.id;

    db.get('SELECT image_path FROM saved_memes WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
        db.run('DELETE FROM saved_memes WHERE id = ? AND user_id = ?', [id, userId], (e2) => {
            if (e2) return res.json({ success: false });

            try {
                if (row && row.image_path) {
                    const rel = row.image_path.startsWith('/') ? row.image_path.slice(1) : row.image_path;
                    const abs = path.join(storageDir, rel);
                    if (fs.existsSync(abs)) fs.unlinkSync(abs);
                }
            } catch (e3) {}

            res.json({ success: true });
        });
    });
});

// Edit Binder Item (only my item)
app.post('/api/memes/binder/:id/edit', requireLogin, express.json(), (req, res) => {
    const userId = req.userId;
    const { name, keywords } = req.body;
    db.run(
        'UPDATE saved_memes SET name = ?, keywords = ? WHERE id = ? AND user_id = ?',
        [name, keywords, req.params.id, userId],
        (err) => res.json({ success: !err })
    );
});


// Save Template
app.post('/api/memes/templates', requireLogin, upload.single('meme'), (req, res) => {
    const userId = req.userId;
    const name = (req.body.name || 'Untitled').trim().substring(0, 50);
    const keywords = (req.body.keywords || '').trim().substring(0, 200);

    if (!req.file) return res.status(400).json({ success: false });

    const relPath = '/uploads/' + req.file.filename;

    let categories = [0];
    try { if (req.body.categories) categories = JSON.parse(req.body.categories); } catch(e){}
    if (categories.length === 0) categories = [0];

    let count = 0;
    let errOccurred = false;

    categories.forEach(catId => {
        db.run(
            'INSERT INTO saved_templates (user_id, name, keywords, image_path, category_id) VALUES (?, ?, ?, ?, ?)',
            [userId, name, keywords, relPath, Number(catId) || 0],
            function(err) {
                if (err) errOccurred = true;
                count++;
                if (count === categories.length) {
                    if (errOccurred) return res.status(500).json({ success: false });
                    res.json({ success: true, path: relPath });
                }
            }
        );
    });
});

// Load Templates (only my items)
app.get('/api/memes/templates', requireLogin, (req, res) => {
    const userId = req.userId;
    db.all(
        'SELECT * FROM saved_templates WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, templates: rows });
        }
    );
});

// Delete Template (only my item)
app.post('/api/memes/templates/delete', requireLogin, express.json(), (req, res) => {
    const userId = req.userId;
    const id = req.body.id;

    db.get('SELECT image_path FROM saved_templates WHERE id = ? AND user_id = ?', [id, userId], (err, row) => {
        db.run('DELETE FROM saved_templates WHERE id = ? AND user_id = ?', [id, userId], (e2) => {
            if (e2) return res.json({ success: false });

            try {
                if (row && row.image_path) {
                    const rel = row.image_path.startsWith('/') ? row.image_path.slice(1) : row.image_path;
                    const abs = path.join(storageDir, rel);
                    if (fs.existsSync(abs)) fs.unlinkSync(abs);
                }
            } catch (e3) {}

            res.json({ success: true });
        });
    });
});

// Edit Template Item (only my item)
app.post('/api/memes/templates/:id/edit', requireLogin, express.json(), (req, res) => {
    const userId = req.userId;
    const { name, keywords } = req.body;
    db.run(
        'UPDATE saved_templates SET name = ?, keywords = ? WHERE id = ? AND user_id = ?',
        [name, keywords, req.params.id, userId],
        (err) => res.json({ success: !err })
    );
});


// Save Progress (editable project)
app.post('/api/memes/progress', requireLogin, upload.single('thumb'), (req, res) => {
    const userId = req.userId;

    if (!req.file) return res.status(400).json({ success: false, error: 'Thumbnail upload failed' });

    const name = (req.body.name || 'Untitled').trim().substring(0, 60);
    const keywords = (req.body.keywords || '').trim().substring(0, 200);
    const stateJson = req.body.state;
    
    let categories = [0];
    try { if (req.body.categories) categories = JSON.parse(req.body.categories); } catch(e){}
    if (categories.length === 0) categories = [0];
    const primaryCat = Number(categories[0]) || 0;

    if (!stateJson || stateJson.length < 10) {
        return res.status(400).json({ success: false, error: 'Invalid state data received' });
    }

    const newThumbPath = '/uploads/' + req.file.filename;

    db.run(
        `INSERT INTO saved_progress (user_id, name, thumb_path, state_json, keywords, category_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, name, newThumbPath, stateJson, keywords, primaryCat],
        function (insertErr) {
            if (insertErr) {
                console.error("Insert Error:", insertErr);
                return res.status(500).json({ success: false, error: 'Failed to save new record' });
            }
            return res.json({ success: true, mode: 'create', id: this.lastID });
        }
    );
});

// Edit Progress Item Name
app.post('/api/memes/progress/:id/edit', requireLogin, express.json(), (req, res) => {

    const name = String((req.body && req.body.name) || "").trim().substring(0, 60);
    const keywords = String((req.body && req.body.keywords) || "").trim().substring(0, 200);
    if (!name) return res.status(400).json({ success: false, error: "Missing name" });

    db.run(
                'UPDATE saved_progress SET name = ?, keywords = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
        [name, keywords, req.params.id, req.userId],

        function(err) {
            if (err) return res.status(500).json({ success: false, error: "Database error" });
            if (this.changes === 0) return res.status(404).json({ success: false, error: "Not found" });
            res.json({ success: true });
        }
    );
});

// List Progress
app.get('/api/memes/progress', requireLogin, (req, res) => {

    res.setHeader('Cache-Control', 'no-store');
    db.all(
                'SELECT id, name, keywords, thumb_path, category_id, created_at, updated_at FROM saved_progress WHERE user_id = ? ORDER BY updated_at DESC',
        [req.userId],

        (err, rows) => {
            if (err) return res.status(500).json({ success: false, error: "Database error", items: [] });
            res.json({ success: true, items: rows });
        }
    );
});


// Load Progress State
app.get('/api/memes/progress/:id', requireLogin, (req, res, next) => {
    if (req.params.id === 'download-zip') return next();
    res.setHeader('Cache-Control', 'no-store');
    db.get(
                'SELECT state_json, name, keywords FROM saved_progress WHERE id = ? AND user_id = ?',
        [req.params.id, req.userId],
        (err, row) => {
            if (err) {
                console.error("DB Load Error:", err);
                return res.status(500).json({ success: false, error: "Database error" });
            }
            if (!row) {
                return res.status(404).json({ success: false, error: "Save not found" });
            }
            res.json({ success: true, state: row.state_json, name: row.name, keywords: row.keywords });
        }
    );
});

// Delete Progress
app.post('/api/memes/progress/delete', requireLogin, express.json(), (req, res) => {
    const id = req.body && req.body.id;
    if (!id) return res.json({ success: false });

        db.get('SELECT thumb_path FROM saved_progress WHERE id = ? AND user_id = ?', [id, req.userId], (err, row) => {
        db.run('DELETE FROM saved_progress WHERE id = ? AND user_id = ?', [id, req.userId], (e2) => {
            if (e2) return res.json({ success: false });

            try {
                if (row && row.thumb_path) {
                                        const rel = row.thumb_path.startsWith('/') ? row.thumb_path.slice(1) : row.thumb_path;
                    const abs = path.join(storageDir, rel);
                    if (fs.existsSync(abs)) fs.unlinkSync(abs);
                }
            } catch (e3) {}

            res.json({ success: true });
        });
    });
});

// Download Progress Zip
app.get('/api/memes/progress/download-zip', requireLogin, (req, res) => {
    db.all('SELECT name, keywords, state_json FROM saved_progress WHERE user_id = ?', [req.userId], (err, rows) => {
        if (err || !rows || !rows.length) return res.status(404).send('No projects found');
        try {
            const archiver = require('archiver');
            const archive = archiver('zip', { store: true });
            res.attachment('My_Meme_Projects.zip');
            archive.pipe(res);

            const usedNames = new Set();
            rows.forEach(r => {
                let name = (r.name || 'Project').trim().replace(/[<>:"/\\|?*]/g, '');
                let fileName = `${name}.mcproj`;
                let counter = 1;
                while (usedNames.has(fileName)) {
                    fileName = `${name} (${counter}).mcproj`;
                    counter++;
                }
                usedNames.add(fileName);

                let stateData = r.state_json;
                try {
                    const stateObj = JSON.parse(r.state_json);
                    stateObj.name = r.name || '';
                    stateObj.keywords = r.keywords || '';
                    stateData = JSON.stringify(stateObj);
                } catch(err) {}

                archive.append(stateData, { name: fileName });
            });
            archive.finalize();
        } catch (e) {
            res.status(500).send('Archiver not installed.');
        }
    });
});


// Download Zip

app.get('/api/memes/:type/download-zip', requireLogin, (req, res) => {
    const type = req.params.type;
    if (type !== 'binder' && type !== 'templates') return res.status(400).send('Bad type');

    const table = type === 'binder' ? 'saved_memes' : 'saved_templates';
    const query = `
        SELECT m.name, m.image_path, c.name AS folder_name
        FROM ${table} m
        LEFT JOIN categories c
            ON m.category_id = c.id
            AND c.user_id = ?
            AND c.type = ?
        WHERE m.user_id = ?
    `;

    db.all(query, [req.userId, type, req.userId], (err, rows) => {
        if (err || !rows.length) return res.status(404).send('No items found');

        
        try {
            const archiver = require('archiver');
            const archive = archiver('zip', { store: true });
            const zipName = type === 'binder' ? 'Meme Collection.zip' : 'Template Collection.zip';
            
            res.attachment(zipName);
            archive.pipe(res);

            const usedPaths = new Set();

            rows.forEach((r) => {
                let name = (r.name || 'image').trim();
                name = name.replace(/[<>:"/\\|?*]/g, '');
                
                let relativePath = r.image_path.startsWith('/') ? r.image_path.substring(1) : r.image_path;
                let filePath = path.join(storageDir, relativePath);

                if (!fs.existsSync(filePath)) return;

                // add file to category folder in ZIP
                const addToZip = (folderName) => {
                    folderName = folderName.replace(/[<>:"/\\|?*]/g, ''); 
                    let fileName = `${name}.png`;
                    let zipPath = `${folderName}/${fileName}`;
                    let counter = 1;

                    while (usedPaths.has(zipPath)) {
                        fileName = `${name} (${counter}).png`;
                        zipPath = `${folderName}/${fileName}`;
                        counter++;
                    }
                    
                    usedPaths.add(zipPath);
                    archive.file(filePath, { name: zipPath });
                };

                // Add to Category Folder
                let catFolder = r.folder_name ? r.folder_name.trim() : "Unsorted";
                addToZip(catFolder);

                // Add to "All Items" Folder
                addToZip("All Items");
            });

            archive.finalize();
        } catch (e) {
            res.status(500).send('Archiver not installed. Run: npm install archiver');
        }
    });
});


app.get('/api/categories/:type', requireLogin, (req, res) => {
    const type = req.params.type;
    if (type !== 'binder' && type !== 'templates' && type !== 'progress') return res.json({ success: true, categories: [] });

    db.all(
        'SELECT * FROM categories WHERE type = ? AND user_id = ? ORDER BY name ASC',
        [type, req.userId],
        (err, rows) => res.json({ success: !err, categories: rows || [] })
    );
});


app.post('/api/categories', requireLogin, express.json(), (req, res) => {
    const name = (req.body.name || '').trim().substring(0, 30);
    const type = req.body.type;

    if (!name || (type !== 'binder' && type !== 'templates' && type !== 'progress')) return res.json({ success: false });

    db.run(
        'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
        [req.userId, name, type],
        function(err) {
            if (err) return res.json({ success: false });
            res.json({ success: true, id: this.lastID, name });
        }
    );
});


app.post('/api/categories/delete', requireLogin, express.json(), (req, res) => {
    const id = Number(req.body && req.body.id);
    const type = req.body && req.body.type;

    if (!id || (type !== 'binder' && type !== 'templates' && type !== 'progress')) return res.json({ success: false });

    const table = type === 'binder' ? 'saved_memes' : (type === 'templates' ? 'saved_templates' : 'saved_progress');

    db.serialize(() => {
        db.run(
            `UPDATE ${table} SET category_id = 0 WHERE category_id = ? AND user_id = ?`,
            [id, req.userId]
        );

        db.run(
            'DELETE FROM categories WHERE id = ? AND user_id = ? AND type = ?',
            [id, req.userId, type],
            (err) => res.json({ success: !err })
        );
    });
});


// Move Item to Category
app.post('/api/memes/:type/move', requireLogin, express.json(), (req, res) => {
    const id = Number(req.body && req.body.id);
    const category_id = Number(req.body && req.body.category_id) || 0;

    const type = req.params.type;
    if (!id || (type !== 'binder' && type !== 'templates' && type !== 'progress')) return res.json({ success: false });

    const table = type === 'binder' ? 'saved_memes' : (type === 'templates' ? 'saved_templates' : 'saved_progress');

    db.run(
        `UPDATE ${table} SET category_id = ? WHERE id = ? AND user_id = ?`,
        [category_id, id, req.userId],
        (err) => res.json({ success: !err })
    );
});


// Copy Item to Category
app.post('/api/memes/:type/copy', requireLogin, express.json(), (req, res) => {
    const id = Number(req.body && req.body.id);
    const category_id = Number(req.body && req.body.category_id) || 0;

    const type = req.params.type;
    if (!id || (type !== 'binder' && type !== 'templates' && type !== 'progress')) return res.json({ success: false });

    if (type === 'progress') {
        db.get(`SELECT name, thumb_path, state_json FROM saved_progress WHERE id = ? AND user_id = ?`, [id, req.userId], (err, row) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (!row) return res.status(404).json({ success: false, error: 'Item not found' });
            db.run(`INSERT INTO saved_progress (user_id, name, thumb_path, state_json, category_id) VALUES (?, ?, ?, ?, ?)`,
                [req.userId, row.name, row.thumb_path, row.state_json, category_id],
                (err2) => {
                    if (err2) return res.status(500).json({ success: false, error: err2.message });
                    res.json({ success: true });
                }
            );
        });
        return;
    }

    const table = type === 'binder' ? 'saved_memes' : 'saved_templates';

    db.get(
        `SELECT name, keywords, image_path FROM ${table} WHERE id = ? AND user_id = ?`,
        [id, req.userId],
        (err, row) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (!row) return res.status(404).json({ success: false, error: 'Item not found' });

            db.run(
                `INSERT INTO ${table} (user_id, name, keywords, image_path, category_id) VALUES (?, ?, ?, ?, ?)`,
                [req.userId, row.name, row.keywords, row.image_path, category_id],
                (err2) => {
                    if (err2) return res.status(500).json({ success: false, error: err2.message });
                    res.json({ success: true });
                }
            );
        }
    );
});

// Start the server and export the port promise
module.exports = new Promise((resolve) => {
    const server = app.listen(PORT, () => {
        const actualPort = server.address().port;
        console.log(`Meme Creator running at http://localhost:${actualPort}`);
        resolve(actualPort);
    });
});

