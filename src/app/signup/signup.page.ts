import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SIGNUP } from '../constants/formValidationMessage';
import { HelperService } from '../providers/helper.service';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../providers/firebase-auth.service';
import { WidgetUtilService } from '../providers/widget-util.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  email: FormControl;
  password: FormControl;
  formError: any = {
    email: '',
    password: ''
  };

  validationMessage: any = SIGNUP;
  showSignupSpinner: boolean = false;

  constructor(private helperservices: HelperService, private router: Router, private firebaseAuthService: FirebaseAuthService,
    private widgetUtilService: WidgetUtilService) { }

  ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  resetForm(){
    this.signupForm.reset();
    this.formError = {
      email: '',
      password: ''
    };
  }

  async signup(){
    try{
      this.showSignupSpinner = true;
      const result = await this.firebaseAuthService.registerWithEmailPassword(this.email.value, this.password.value);
      console.log('result', result)
      this.showSignupSpinner = false;
      this.widgetUtilService.presentToast('Registro exitoso! Email de verificación enviado!');
      this.resetForm();
      this.router.navigate(['/home']);
    }catch (error){
      console.log('Error', error);
      this.showSignupSpinner = false;
      this.widgetUtilService.presentToast(error.message);
    }
      
  }

  goToLoginPage(){
    this.router.navigate(['/login']);
  }

  createFormControl(){
    this.email = new FormControl('',[
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl('',[
      Validators.required,
      Validators.minLength(5)
    ]);
  }

  createForm(){
    this.signupForm = new FormGroup({
      email: this.email,
      password: this.password
    });
    this.signupForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data){
    this.formError=this.helperservices.prepareValidationMessage(this.signupForm, this.validationMessage, this.formError);
  }


}
