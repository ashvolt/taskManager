import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/app.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

  myForm: FormGroup;
  constructor(private fb: FormBuilder,private appService: AppService,private _snackBar: MatSnackBar,private _matdialog:MatDialog,private sharedService: SharedService,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.myForm = this.fb.group({
      id: Date.now().toString(),
      title: '',
      description: '',
      status: 'To Do',
      percentage:'',
      priority:'Low',
      assignee:''
    });
  }

  ngOnInit(): void {
    if(this.data.id) {
      this.myForm.patchValue(this.data)
    }
    console.log(this.data)
  }
  
  onSubmit() {
    console.log(this.myForm.value);
    this.appService.postLogEntry(this.myForm.value).subscribe(
      response => {
        this.triggerEvent()
        this.openSnackBar('Task Created','Close')
       this._matdialog.closeAll()
      },
      error => {
        this.openSnackBar('Task Creation Failed','Close')
        console.error('Error submitting log entry', error);
      }
    );
  }
  onUpdate() {
    this.appService.putLogEntry(this.data.id,this.myForm.value).subscribe(
      response => {
        this.triggerEvent()
        this.openSnackBar('Task Updated','Close')
       this._matdialog.closeAll()
      },
      error => {
        this.openSnackBar('Task Updation Failed','Close')
        console.error('Error submitting log entry', error);
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  triggerEvent() {
    this.sharedService.emitChange('loadTasks');
  }
}
