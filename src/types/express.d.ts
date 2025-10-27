import 'express-serve-static-core';

import express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
