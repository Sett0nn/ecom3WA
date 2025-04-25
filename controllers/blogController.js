const fs = require('fs');

module.exports = (BlogModel) => {
    const getAllBlogs = async (req, res) => {
        const blogs = await BlogModel.getAllBlogs();
        blogs.code
            ? res.json({ status: 500, msg: "Erreur serveur" })
            : res.json({ status: 200, result: blogs });
    };

    const getOneBlog = async (req, res) => {
        const blog = await BlogModel.getOneBlog(req.params.id);
        blog.code
            ? res.json({ status: 500, msg: "Erreur serveur" })
            : res.json({ status: 200, result: blog[0] });
    };

    const saveBlog = async (req, res) => {
        const result = await BlogModel.saveOneBlog(req);
        result.code
            ? res.json({ status: 500, msg: "Erreur à l'enregistrement" })
            : res.json({ status: 200, msg: "Article enregistré" });
    };

    const updateBlog = async (req, res) => {
        const result = await BlogModel.updateOneBlog(req, req.params.id);
        result.code
            ? res.json({ status: 500, msg: "Erreur à la mise à jour" })
            : res.json({ status: 200, msg: "Article mis à jour" });
    };

    const deleteBlog = async (req, res) => {
        const result = await BlogModel.deleteOneBlog(req.params.id);
        result.code
            ? res.json({ status: 500, msg: "Erreur à la suppression" })
            : res.json({ status: 200, msg: "Article supprimé" });
    };

    return {
        getAllBlogs,
        getOneBlog,
        saveBlog,
        updateBlog,
        deleteBlog,
    };
};
