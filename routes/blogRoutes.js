const withAuthAdmin = require('../middleware/withAuthAdmin');

module.exports = (app, db) => {
    const BlogModel = require('../models/BlogModel')(db);
    const blogController = require('../controllers/blogController')(BlogModel);

    app.get('/api/v1/blog/all', blogController.getAllBlogs);
    app.get('/api/v1/blog/one/:id', blogController.getOneBlog);
    app.post('/api/v1/blog/save', withAuthAdmin, blogController.saveBlog);
    app.put('/api/v1/blog/update/:id', withAuthAdmin, blogController.updateBlog);
    app.delete('/api/v1/blog/delete/:id', withAuthAdmin, blogController.deleteBlog);
};
