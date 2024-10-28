import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.page.html',
  styleUrls: ['./recover-pass.page.scss'],
})
export class RecoverPassPage implements OnInit {
  recoverPassForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.recoverPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.recoverPassForm.valid) {
      console.log('Formulário enviado com sucesso:', this.recoverPassForm.value);
    } else {
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      console.log('Formulário inválido');
    }
  }
}
