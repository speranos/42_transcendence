import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost){
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request  = ctx.getRequest()
        const status = exception.getStatus()
        response.status(status).json({statusCode: status, message: exception.getResponse(), path: request.url})
    }

}