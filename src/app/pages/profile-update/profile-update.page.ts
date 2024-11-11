import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.page.html',
  styleUrls: ['./profile-update.page.scss'],
})
export class ProfileUpdatePage {
  profileUpdateForm: FormGroup;
  // usuario: User;

  constructor(
    private formBuilder: FormBuilder,
    // private afAuth: AngularFireAuth,
    // private router: Router
  ) {
    this.profileUpdateForm = this.formBuilder.group({
      name: ['Nome Teste', [Validators.required, Validators.minLength(2)]],
      lastname: ['Sobrenome Teste', [Validators.required, Validators.minLength(2)]],
      birthdata: ['1999-01-01', Validators.required],
      user: ['@usuarioteste', [Validators.required, Validators.minLength(3)]],
      email: ['email@domain.com', [Validators.required, Validators.email]],
      // name: [usuario.name, [Validators.required, Validators.minLength(2)]],
      // lastname: [usuario.lastname, [Validators.required, Validators.minLength(2)]],
      // birthdata: [usuario.birthDate, Validators.required],
      // user: [usuario.username, [Validators.required, Validators.minLength(3)]],
      // email: [usuario.email, [Validators.required, Validators.email]],
    }, {});
  }

  openDatePicker() {
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  }

  async onSubmit() {
    // if (this.registerForm.valid) {
    //   const { email, password } = this.registerForm.value;
    //   try {
    //     const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    //
    //     console.log('Usuário registrado com sucesso', userCredential);
    //     this.router.navigate(['/home']);
    //
    //   } catch (error) {
    //     console.log('Erro ao registrar usuário:', error);
    //   }
    // } else {
    //   console.log('Formulário inválido', this.registerForm.errors);
    // }
  }
}
