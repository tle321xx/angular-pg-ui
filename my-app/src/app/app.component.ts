import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from './services/api.service';
import { MatTableDataSource } from '@angular/material/table'
import { User } from './models/user.model';

interface Genders {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'my-app';

  public registerForm!: FormGroup;

  public actionBtn : string = 'Add'

  public isUpdateActive : boolean = false

  public genders : Genders[] = [
    { value: '', viewValue: ''},
    { value: 'M', viewValue: 'Male'},
    { value: 'F', viewValue: 'Female'},
    { value: 'U', viewValue: 'Unknown'},
  ]

  public users !: User[]

  public userIdToEdit !: number;

  public tooltipContent: string = '';
  public showGenderTooltip: boolean = false;

  displayedColumns: string[] = ['id', 'action', 'firstname', 'lastname', 'gender', 'score'];
  dataSource!: MatTableDataSource<any>;

  constructor(private fb: FormBuilder, private api : ApiService) {}

  ngOnInit(): void {
    this.fetchAllUsers()
      this.registerForm = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        gender: ['', Validators.required],
        score: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      })
  }

  handleSubmit(){
  // console.log(this.registerForm.value);
    this.api.postRegisterUser(this.registerForm.value).subscribe({
      next: (res)=>{
        alert('Success')
        this.fetchAllUsers()
        this.registerForm.reset()
        this.registerForm.markAsPristine();
        this.registerForm.markAsUntouched();
        this.actionBtn = 'Add';
      },
      error: (err)=> {
        alert('Error While submit')
      }
    })
  }

  fetchAllUsers(){
    this.api.getAllRegisterUser().subscribe({
      next: (res) => {
        this.users = res;
        this.dataSource = new MatTableDataSource(this.users);
      },
      error: (err => {
        alert('Error While Fetching Data')
      })

    })
  }

  editUser(id : number){
    this.userIdToEdit = id;
    if(this.userIdToEdit !== undefined){
      this.api.getRegisterUserId(this.userIdToEdit).subscribe({
        next: (res)=>{
          this.isUpdateActive = true;
          this.actionBtn = 'Edit'
          this.fetchDataInForm(res as User)
        },
        error: (err)=>{
          console.log(err);
        }
      })
    }
  }

  fetchDataInForm(user: User){
    this.registerForm.patchValue({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      gender: user.gender || '',
      score: user.score || ''
    })
  }

  handleSubmitEdit(){
    this.api.putRegisterUser(this.registerForm.value, this.userIdToEdit).subscribe({
      next: (res)=> {
        alert('Update User Successfully')
        this.registerForm.reset()
        this.isUpdateActive = false;
        this.actionBtn = 'Add';
        this.fetchAllUsers()
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  handleCancel(){
    this.registerForm.reset()
    this.isUpdateActive = false;
    this.actionBtn = 'Add';
    this.fetchAllUsers()
  }

  showGender(gender: string) {
    this.showGenderTooltip = true;
    this.tooltipContent = gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Unknown';
  }

  hideGenderTooltip() {
    this.showGenderTooltip = false;
  }

}



