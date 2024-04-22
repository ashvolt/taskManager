import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SecureInnerPageGuard } from './shared/guard/secure-inner-page.guard';
import { CreateTaskComponent } from './components/create-task/create-task.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [SecureInnerPageGuard]},
  { path: 'sign-in', component: SignInComponent, canActivate: [AuthGuard] },
  { path: 'register-user', component: SignUpComponent , canActivate: [AuthGuard]},
  // { path: 'dashboard', component: DashboardComponent , canActivate: [SecureInnerPageGuard]},
  // { path: 'forgot-password', component: ForgotPasswordComponent },
   { path: 'verify-email-address', component: VerifyEmailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
