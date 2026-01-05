import { Context } from 'hono';

export const errorHandler = (err: any, c: Context) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  return c.json(
    {
      error: {
        message,
        status,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
    },
    status as any
  );
};
