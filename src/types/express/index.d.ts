import { JwtPayload } from '../../model/Jwt';

declare global{
    namespace Express{
        interface Request {
            user?: JwtPayload;
        }
    }
}

