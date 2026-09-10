import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthJwtService } from '../auth-jwt.service';

@Component({
  selector: 'app-jwt-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly auth = inject(AuthJwtService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.signOut().subscribe(() => this.router.navigateByUrl('/jwt/login'));
  }
}
