import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.initializeGoogleAuth();
  }

  private async initializeGoogleAuth() {
    if (typeof window !== 'undefined' && window.Capacitor) {
      GoogleAuth.initialize({
        clientId: '894817520084-6nee0nlld2vt1dubmkj41lem1sjfaku6.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        this.successMessage = 'Login bem-sucedido! Redirecionando...';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        }, 3000);

      } catch (error: any) {
        this.successMessage = '';
        console.log('Erro ao fazer login:', error);

        if (error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Credenciais inválidas. Verifique o e-mail e a senha.';
        } else {
          this.errorMessage = 'Erro ao autenticar. Tente novamente.';
        }
      }
    } else {
      console.log('Formulário inválido');
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      this.successMessage = '';
    }
  }
  async loginWithGoogle() {
    try {
      console.log("Iniciando o login com Google...");
      await GoogleAuth.signIn();
      console.log("Login bem-sucedido com Google.");
      this.successMessage = 'Login com Google bem-sucedido!';
      this.errorMessage = '';
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 3000);
    } catch (error) {
      if (error=== 'popup_closed_by_user') {
        this.errorMessage = 'Login cancelado. Por favor, tente novamente.';
      } else {
        console.log('Erro ao fazer login com Google:', error);
        this.errorMessage = 'Erro ao autenticar com Google. Tente novamente.';
      }
    }
  }
  async loginWithFacebook() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      const user = result.user;
      this.successMessage = 'Login com Google bem-sucedido!';
      this.errorMessage = '';
      setTimeout(() => {
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }, 3000);
    } catch (error) {
      console.log('Erro ao fazer login com Facebook:', error);
      this.successMessage = '';
      this.errorMessage = 'Erro ao autenticar com Facebook. Tente novamente.';
    }
  }
  async loginWithX() {
    try {
      const provider = new OAuthProvider('twitter.com');
      const result = await this.afAuth.signInWithPopup(provider);
      this.successMessage = 'Login com X (Twitter) bem-sucedido!';
      this.errorMessage = '';
      setTimeout(() => {
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }, 3000);
    } catch (error) {
      console.log('Erro ao fazer login com X (Twitter):', error);
      this.successMessage = '';
      this.errorMessage = 'Erro ao autenticar com X (Twitter). Tente novamente.';
    }
  }
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
