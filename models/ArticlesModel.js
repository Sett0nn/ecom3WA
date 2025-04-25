const db = require('../config/db');

const ArticlesModel = {
  // Récupérer tous les articles
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Articles ORDER BY created_at DESC', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Récupérer un article par son ID
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Articles WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  // Créer un nouvel article
  create: (article) => {
    const { title, slug, content, image, alt, published, author_id } = article;
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO Articles (title, slug, content, image, alt, published, author_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, slug, content, image, alt, published, author_id],
        (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, ...article });
        }
      );
    });
  },

  // Mettre à jour un article existant
  update: (id, article) => {
    const { title, slug, content, image, alt, published } = article;
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE Articles SET title = ?, slug = ?, content = ?, image = ?, alt = ?, published = ?, updated_at = NOW() WHERE id = ?`,
        [title, slug, content, image, alt, published, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  // Supprimer un article
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM Articles WHERE id = ?', [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
};

module.exports = ArticlesModel;