import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthCookieService } from '../auth-cookie.service';

@Component({
  selector: 'app-cookie-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly auth = inject(AuthCookieService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/cookies/login'));
  }
}
