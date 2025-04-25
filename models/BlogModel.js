module.exports = (db) => {
    class BlogModel {
        static getAllBlogs() {
            return db.query('SELECT * FROM blog')
                .then(res => res)
                .catch(err => err);
        }

        static getOneBlog(id) {
            return db.query('SELECT * FROM blog WHERE id = ?', [id])
                .then(res => res)
                .catch(err => err);
        }

        static saveOneBlog(req) {
            const { title, content, image } = req.body;
            return db.query(
                'INSERT INTO blog (title, content, image) VALUES (?, ?, ?)',
                [title, content, image]
            ).then(res => res).catch(err => err);
        }

        static updateOneBlog(req, id) {
            const { title, content, image } = req.body;
            return db.query(
                'UPDATE blog SET title = ?, content = ?, image = ? WHERE id = ?',
                [title, content, image, id]
            ).then(res => res).catch(err => err);
        }

        static deleteOneBlog(id) {
            return db.query('DELETE FROM blog WHERE id = ?', [id])
                .then(res => res)
                .catch(err => err);
        }
    }

    return BlogModel;
};
