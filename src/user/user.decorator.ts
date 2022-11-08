import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

import * as requestIp from 'request-ip';

export const IpAddress = createParamDecorator((data, req) => {
	if (req.clientIp)
		return req.clientIp;
	return requestIp.getClientIp(req); // In case we forgot to include requestIp.mw() in main.ts
});

export const UserData = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().userData;
    }
)

export const JWT = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().headers['authorization']?.replace('Bearer ', '');
    }
)