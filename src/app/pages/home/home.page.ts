import { Component, ViewChild ,OnInit} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Question } from '../../models/questionModel';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private firestore : AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }
  
 

  @ViewChild(IonModal) modal: IonModal | undefined;
  message: string = "";
  name: string = "";
  userId: string = '';
  content: string = '';

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid; 
      } else {
        
        console.log('Usuário não logado');
      }
    });
   }


  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  
  async confirm() {
      try{
      if (!this.userId) { 
        console.log('Erro: usuário não está logado.');
        return
      }
      const newQuestion: Question = {
        userId: this.userId, 
        content: this.content,
        likes: 0, 
        answersCount: 0, 
        createdAT: new Date() 
      }
      const questionRef = await this.firestore.collection('questions').add(newQuestion);

      console.log('New question created:', newQuestion); 
    
      this.modal?.dismiss(this.name, 'confirm');
      }catch (error) {
        console.error('Erro ao criar a pergunta:', error);
      }
  }

}
