import Comment from './comment.model';
import Movie from "./movie.model";

export const postComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { slug } = req.params;
        const movie = await Movie.findOne({ slug });
        const { id } = res.locals.user;
        const newComment = await Comment.create({
            user: id,
            movie,
            content,
        });

        req.session.success = "Bình luận thành công!";
        res.redirect(`/movies/${slug}#cmt-${newComment.id}`);
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const { slug } = req.params;
        const movie = await Movie.findOne({ slug });
        const comments = await Comment.find({ movie }).sort({ createdAt: -1 });
        res.json({ success: true, data: comments });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const deleteComment = async (req, res) => {
}

export const getFilmComments = async (req, res) => {
    try {
        const { slug } = req.params;
        const movie = await Movie.findOne({ slug });
        const comments = await Comment.find({ movie }).sort({ createdAt: -1 });
        res.render("comments", { comments });
        res.json({ success: true, data: comments });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

export const putComment = async (req, res) => {
}

export const increaseLikeCount = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (comment.likes.includes(res.locals.user.id)) {
            await comment.likes.pull(res.locals.user.id);
        } else {
            await comment.likes.push(res.locals.user.id);
        }
        await comment.save();
        console.log(comment);

        res.json({ success: true, data: comment });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}

export const replyComment = async (req, res) => {
    try {
        //const { content } = req.body;
        const content = "new content reply";
        const { id } = req.params;
        const comment = await Comment.findById(id);
        const reply = await Comment.create({
            user: id,
            movie: comment.movie,
            content,
            parent: comment,
        });
        await comment.reply.push(reply);
        await comment.save();


        res.json({ success: true, data: reply });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
}