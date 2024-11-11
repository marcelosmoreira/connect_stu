import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from '../../models/userModel';  // Importando a interface User corretamente
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { Timestamp } from 'firebase/firestore';  // Importando Timestamp para manipulação correta

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      name: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      birthDate: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Obter os dados do usuário do Firestore
        this.firestore.collection('users').doc(user.uid).get().subscribe(doc => {
          if (doc.exists) {
            // Cast para User (garantindo que os dados seguem o formato esperado)
            const data = doc.data() as User; // Forçando o tipo para User
            
            // Verificando se os dados existem, caso contrário, usando valores padrão
            const userData: User = {
              id: user.uid,
              name: data?.name || 'Nome Teste',
              lastName: data?.lastName || 'Sobrenome Teste',
              username: data?.username || '@usuarioteste',
              email: user.email || 'email@domain.com',
              birthDate: this.convertTimestampToDate(data?.birthDate) || new Date('1999-01-01'),
              createdAT: this.convertTimestampToDate(data?.createdAT) || new Date(),
            };

            // Preencher os campos do formulário com os dados do usuário
            this.profileForm.patchValue({
              name: userData.name,
              lastName: userData.lastName,
              username: userData.username,
              email: userData.email,
              birthDate: userData.birthDate.toISOString().split('T')[0]  // Formato de data para o campo 'date'
            });
          } else {
            console.log("Documento não encontrado");
          }
        });
      }
    });
  }

  // Função para converter um Timestamp do Firestore para Date
  convertTimestampToDate(timestamp: any): Date | null {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return null;  // Caso o valor não seja um Timestamp, retorna null
  }

  // Redireciona para a home
  goToHome() {
    this.router.navigate(['/home']);
  }

  // Alterna o estado de edição
  goToUpdateProfile() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  // Salva os dados do formulário no Firestore
  async onSaveProfile() {
    if (this.profileForm.valid) {
      const updatedUser: User = this.profileForm.value;

      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        updatedUser.id = currentUser.uid;  // Usando o ID do usuário logado no Firebase
      }

      try {
        // Atualizando os dados no Firestore
        await this.firestore.collection('users').doc(updatedUser.id).update(updatedUser);
        console.log('Dados salvos com sucesso no Firestore');

        // Após salvar os dados, desabilita os campos e redireciona para a home
        this.profileForm.disable();
        this.isEditing = false;
        this.goToHome();
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        alert('Houve um erro ao salvar os dados. Tente novamente.');
      }
    } else {
      console.log('Formulário inválido');
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}
