import express, { Application } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.route';
import { AdminRoutes } from './app/modules/admin/admin.route';

const app:Application = express();
app.use(cors());

app.use(express.json());

app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/admins', AdminRoutes)

app.get('/', (req, res)=>{
    res.send({
        message: 'PH Healthcare Application is running 🐱'
    })
})

export default app;