import { inferRouterOutputs } from '@trpc/server';
import { links } from './routers/links';
import { router } from './trpc';
 
export const appRouter = router({
  links
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>