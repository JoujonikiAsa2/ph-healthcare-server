import express, { Application } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.route';
import { AdminRoutes } from './app/modules/admin/admin.route';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';

const app:Application = express();
app.use(cors());

app.use(express.json());

app.use('/api/v1', router);

app.get('/', (req, res)=>{
    res.send({
        message: 'PH Healthcare Application is running 🐱'
    })
})

app.use(globalErrorHandler)

export default app;