// src/app/social-login/social-login.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-social-login',
  template: '<p>Procesando inicio de sesión...</p>'
})
export class SocialLoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // usa el método que agregamos al AuthService
        this.authService.processSocialLogin(token);
        this.router.navigate(['/perfil']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
