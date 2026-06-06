import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        (error.error as { error?: string })?.error ??
        error.message ??
        'An unexpected error occurred';

      if (error.status !== 401) {
        snackBar.open(message, 'Dismiss', { duration: 5000 });
      }

      return throwError(() => error);
    }),
  );
};
