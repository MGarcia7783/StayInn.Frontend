import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyecciòn de dependiencias
  const authService = inject(AuthService);

  // Obtener el token del servicio de autenticación
  const token = authService.obtenerToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Enviar peticiòn al servidor
  return next(req);
};
