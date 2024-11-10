import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.page.html',
  styleUrls: ['./recover-pass.page.scss'],
})
export class RecoverPassPage implements OnInit {
  recoverPassForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.recoverPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.recoverPassForm.valid) {
      const { email } = this.recoverPassForm.value;
      try {
        await this.afAuth.sendPasswordResetEmail(email);
        this.successMessage = 'Um link para recuperação de senha foi enviado para seu e-mail.';
        this.errorMessage = '';
  
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); 
      } catch (error) {
        console.log('Erro ao enviar o e-mail de recuperação:', error);
        this.errorMessage = 'Ocorreu um erro ao enviar o e-mail. Verifique o e-mail fornecido e tente novamente.';
        this.successMessage = '';
      }
    } else {
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      this.successMessage = '';
      console.log('Formulário inválido');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
