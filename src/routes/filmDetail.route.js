
import { Router } from 'express'

const router = Router();

router.get('/', (req, res) => {
    res.render('phim/thong-tin', { title: 'Danh sách phim' })
});

export default router;