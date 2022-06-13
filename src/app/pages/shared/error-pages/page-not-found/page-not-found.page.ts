import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppConfigService } from 'src/app/services/shared/app-configuration/app-config.service';
import { AuthServerProvider } from 'src/app/services/shared/auth/auth-jwt.service';

@Component({
  selector: 'app-page-not-found.page',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss'],
})
export class PageNotFoundPage implements OnInit {
  constructor(private appConfigService: AppConfigService,
    private authServerProvider: AuthServerProvider,
    private navController: NavController
    ) { }
 
  ngOnInit() {
  
  }

  goToLogin(){
    this.appConfigService.logout();
    this.authServerProvider.logout().subscribe();
    this.navController.navigateBack('login');
  }
}
