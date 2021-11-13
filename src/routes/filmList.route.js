import { Router } from 'express'

const router = Router();

router.get('/', (req, res) => {
    res.render('danh-sach', { title: 'Danh sách phim' })
});

export default router;