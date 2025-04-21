import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFoundErrorHandler } from './app/middlewares/notFoundErrorHandler';

const app:Application = express();
app.use(cors());
app.use(cookieParser());

app.use(express.json());

app.use('/api/v1', router);

app.get('/', (req, res)=>{
    res.send({
        message: 'PH Healthcare Application is running 🐱'
    })
})

app.use(globalErrorHandler)
app.use(notFoundErrorHandler)

export default app;
