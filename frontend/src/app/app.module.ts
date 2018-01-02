//=======Modules======
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';

//======Components======
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ThumbnailSliderComponent } from './pages/home/thumbnail-slider/thumbnail-slider.component';
import { ThumbnailComponent } from './pages/home/thumbnail-slider/thumbnail/thumbnail.component';
import { SignupComponent } from './pages/home/loginsignup/signup/signup.component';
import { LoginComponent } from './pages/home/loginsignup/login/login.component'
import { FundraiserRegisterComponent } from './pages/fundraiser-register/fundraiser-register.component';
import { StepOneComponent } from './pages/fundraiser-register/step-one/step-one.component';
import { StepTwoComponent } from './pages/fundraiser-register/step-two/step-two.component';
import { StepThreeComponent } from './pages/fundraiser-register/step-three/step-three.component';
import { UserprofileComponent } from './pages/userprofile/userprofile.component';
import { LoginsignupComponent } from './pages/home/loginsignup/loginsignup.component';
import { VerifyphoneComponent } from './pages/fundraiser-register/verifyphone/verifyphone.component'
import { AdminLoginComponent } from './pages/admin-login/admin-login.component'
import { FundraisersComponent } from './pages/fundraisers/fundraisers.component'
import { AllFundraisersComponent } from './pages/fundraisers/all-fundraisers/all-fundraisers.component';
import { FrProfileComponent } from './pages/fundraisers/fr-profile/fr-profile.component'
import { FundraiserTeaserComponent } from './pages/fundraisers/all-fundraisers/fundraiser-teaser/fundraiser-teaser.component';
import { HomeBannerComponent } from './pages/home/home-banner/home-banner.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { FrTilesComponent } from './pages/home/fr-tiles/fr-tiles.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { HiringComponent } from './pages/hiring/hiring.component';

//======== Services ======

import { AuthserviceService }from './services/authservice.service';
import { TokenAndUserData } from './services/token-and-user-data'
import { AuthGuardService } from './authGuard/auth-guard.service';
import { CampaignService } from './pages/fundraiser-register/campaign.service';
import { GeneralService } from './services/general.service';
import { SeoService } from './services/seo.service';
import { SocialShareService } from './services/socialshare.service';
import { OrganizationDetailsComponent } from './pages/fundraiser-register/organization-details/organization-details.component';
import { DataValidationService } from './services/data-validation.service';
import { AdminGuardService } from './authGuard/admin-guard.service';
import { AdminAuthService } from './services/admin-auth.service';
import { FundraiserLoadService } from './services/fundraiser-load.service';






//======Routes=======
const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'admin',redirectTo:'admin/log-in'},  
  { path: 'admin/log-in', component: AdminLoginComponent},  
  { path: 'admin/dashboard', component: DashboardComponent,canActivate:[AdminGuardService]},  
  { path: 'fundraiser/register', component: FundraiserRegisterComponent, canActivate:[AuthGuardService]},  
  { path: 'fundraisers', component: FundraisersComponent,children:[
    {path: 'sadaqah-zakaat',component: AllFundraisersComponent},    
    {path: 'sadaqah-zakaat/:frname',component: FrProfileComponent},    
  ]},  
  { path:'how-it-works',component: HowItWorksComponent},
  { path: 'fundraisers', redirectTo:'fundraisers/sadaqah-zakaat'},   
  { path: 'profile', component: UserprofileComponent, canActivate:[AuthGuardService] },
  { path: 'profile/:token', component: UserprofileComponent },
  { path: 'stories', component: StoriesComponent },
  { path: 'openings', component: HiringComponent },
  { path: '**', redirectTo:''}
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ThumbnailSliderComponent,
    ThumbnailComponent,
    SignupComponent,
    LoginComponent,
    FundraiserRegisterComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    UserprofileComponent,
    LoginsignupComponent,
    VerifyphoneComponent,
    OrganizationDetailsComponent,
    AdminLoginComponent,
    FundraisersComponent,
    FundraiserTeaserComponent,
    AllFundraisersComponent,
    FrProfileComponent,
    HomeBannerComponent,
    AdminComponent,
    DashboardComponent,
    FrTilesComponent,
    HowItWorksComponent,
    StoriesComponent,
    HiringComponent,

  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverrendered-app'}),
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    { provide: 'isBrowser', useValue: true },
    AuthserviceService,
    AuthGuardService,
    TokenAndUserData,
    AdminGuardService,
    AdminAuthService,
    CampaignService,
    FundraiserLoadService,
    GeneralService,
    SeoService,
    DataValidationService,
    SocialShareService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
