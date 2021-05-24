import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors"
import createConnection from './database' //n precisa indicar o index, por padrao procura por index
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection()

const app = express();

/**
 * GET - busca
 * POST - salvar
 * PUT - alterar
 * DELETE - deletar
 * PATCH - alteração especifica
 */

app.use(express.json())

app.use(router)

app.use((err: Error, request: Request, response:Response, _next: NextFunction) => {
    if(err instanceof AppError){
        return response.status(err.statusCode).json({
            message: err.message
        })
    }

    return response.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    })
})

export{app}