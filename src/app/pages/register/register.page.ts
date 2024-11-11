import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../../models/userModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3), this.noSpacesValidator]],
      email: ['', [Validators.required, Validators.email, this.noSpacesValidator]],
      password: ['', [Validators.required, Validators.minLength(6), this.noSpacesValidator]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  noSpacesValidator(control: any) {
    if (control.value && control.value.indexOf(' ') !== -1) {
      return { hasSpaces: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      try {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const newUser: User = {
          name: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          username: this.registerForm.value.username,
          email: email,
          birthDate: new Date(this.registerForm.value.birthDate),
          createdAT: new Date()
        };

        await this.firestore.collection('users').doc(userCredential.user?.uid).set(newUser);
        console.log('Usuário registrado e salvo no Firestore com sucesso');
        this.router.navigate(['/login']);
      } catch (error) {
        console.log('Erro ao registrar usuário:', error);
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  openDatePicker() {
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  }
}
