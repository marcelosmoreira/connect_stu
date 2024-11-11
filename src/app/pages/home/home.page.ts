import { Component, ViewChild ,OnInit} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Question } from '../../models/questionModel';
import { User } from '../../models/userModel'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators'
import { forkJoin } from 'rxjs';
import { of } from 'rxjs';  


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private firestore : AngularFirestore,
    private afAuth: AngularFireAuth,

  ) { }
  
 

  @ViewChild(IonModal) modal: IonModal | undefined;
  message: string = "";
  name: string = "";
  userId: string = '';
  content: string = '';
  questions$: Observable<Question[]> | null = null;

  ngOnInit() {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid; 
      } else {
        
        console.log('Usuário não logado');
      }
    })
    this.loadQuestions()
   }
   loadQuestions() {
    this.questions$ = this.firestore
      .collection<Question>('questions')
      .valueChanges({ idField: 'id' }) // Mantém o id para cada questão
      .pipe(
        concatMap(questions => {
          // Criando um array de observáveis para buscar os usernames
          const observables = questions.map(question => {
            if (question.userId && typeof question.userId === 'string') {
              // Verifica se userId é uma string válida
              return this.firestore
                .collection('users')
                .doc(question.userId)
                .get()
                .pipe(
                  map(userDoc => {
                    if (userDoc.exists) {
                      const user = userDoc.data() as User;
                      question['username'] = user.username; // Associando username à pergunta
                    } else {
                      question['username'] = 'Usuário Desconhecido'; // Caso não encontre o usuário
                    }
                    return question;
                  })
                );
            } else {
              // Caso o userId seja indefinido ou inválido, já retorna a pergunta com 'Usuário Desconhecido'
              question['username'] = 'Usuário Desconhecido';
              return of(question); // Retorna a pergunta com o username já atribuído
            }
          });
  
          // Usando forkJoin para aguardar todas as requisições
          return forkJoin(observables);
        })
      );
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
