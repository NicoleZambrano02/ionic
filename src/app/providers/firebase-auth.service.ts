import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ThrowStmt } from '@angular/compiler';
import { auth } from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(private angularFireAuth: AngularFireAuth, private googlePlus: GooglePlus, private helperService: HelperService) { }

  async registerWithEmailPassword(email, password){
    try{
      const result = await this.angularFireAuth.auth.createUserWithEmailAndPassword(email,password);
      await this.angularFireAuth.auth.currentUser.sendEmailVerification();
      return result;
    } catch (error){
      throw new Error(error);
    } 
  }

  async signinWithEmailPassword(email, password){
    try{
      const result = await this.angularFireAuth.auth.signInWithEmailAndPassword(email,password);
      return result;
    } catch (error){
      throw new Error(error);
    } 
  }

  async logout(){
    try{
      await this.angularFireAuth.auth.signOut();
      if(this.helperService.isNativePlatform()){
        this.nativeGoogleLogout();
      }
    }catch(error){
      throw new Error(error);
    }
  }

  getAuthState(){
    return this.angularFireAuth.authState;
  }

  async googleLoginWeb(){
    try{
      await this.angularFireAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
    }catch(error){
      throw new Error(error);
    } 
  }

  async nativeGoogleLogin(){
    try{
      const result= await this.googlePlus.login({
        webClientId: '256172688280-fq1puvddrs915vlbh8ua5cbo5kod4gtt.apps.googleusercontent.com',
        offline: true,
        scope: 'profile email'
      });
      await this.angularFireAuth.auth.signInAndRetrieveDataWithCredential(auth.GoogleAuthProvider.credential(result.idToken));
      return result;
    }catch(error){
      throw new Error(error);
    } 
  }

  async nativeGoogleLogout(){
    try{
      await this.googlePlus.logout();
    }catch(error){
      throw new Error(error);
    }
    
  }
}
