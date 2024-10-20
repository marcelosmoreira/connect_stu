import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-screen-loading',
  templateUrl: './screen-loading.page.html',
  styleUrls: ['./screen-loading.page.scss'],
})
export class ScreenLoadingPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 4000);
  }

}
