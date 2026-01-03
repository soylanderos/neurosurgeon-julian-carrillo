import { HttpInterceptorFn } from '@angular/common/http';
import { HttpContextToken } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const NO_TRANSFER_CACHE = new HttpContextToken<boolean>(() => false);

export const noTransferCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Si esta request está marcada, le metemos headers para evitar caches raros
  if (req.context.get(NO_TRANSFER_CACHE)) {
    const patched = req.clone({
      setHeaders: {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      },
    });

    return next(patched);
  }

  return next(req);
};
