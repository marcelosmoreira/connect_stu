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
  usernameHasSpace: boolean = false;
  emailHasSpace: boolean = false;

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
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  validateSpaces() {
    const username = this.registerForm.get('username')?.value;
    const email = this.registerForm.get('email')?.value;

    this.usernameHasSpace = /\s/.test(username);
    this.emailHasSpace = /\s/.test(email);
  }

  async onSubmit() {
    this.validateSpaces();
    if (this.registerForm.valid && !this.usernameHasSpace && !this.emailHasSpace) {
      const { email, password } = this.registerForm.value;
      try {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const newUser: User = {
          name: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          username: this.registerForm.value.username,
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
      console.log('Formulário inválido', this.registerForm.errors);
    }
  }

  // Abre o seletor de data
  openDatePicker() {
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  }
}
