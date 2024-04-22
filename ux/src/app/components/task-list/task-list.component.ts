import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TaskItem } from 'src/app/shared/types';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  constructor(private appService: AppService,private sharedService: SharedService,public dialog: MatDialog,private _snackBar: MatSnackBar) { }
  taskList :TaskItem[] = []
  ngOnInit(): void {
    this.loadLogs()
    this.sharedService.changeEmitted$.subscribe(
      text => {
        if(text = 'loadTasks') {
          this.loadLogs()
        }
      });
  }

  loadLogs() {
    this.appService.getAllLogs(undefined,'createdDateTime','desc').subscribe(
      (data:TaskItem[]) => {
        this.taskList = data;
      },
      (error:any) => {
        console.error('There was an error retrieving logs', error);
      }
    );
  }
  updateStatus(item:TaskItem) {
    this.appService.putLogEntry(item.id,{status:item.status == 'To Do'?'In Progress':item.status == 'In Progress'?'Done' :''}).subscribe(
      response => {
        this.triggerEvent()
        this.openSnackBar('Task Updated','Close')
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
  deleteTask(id:string) {
    this.appService.deleteLog(id).subscribe(
      response => {
        this.triggerEvent()
        this.openSnackBar('Task Deleted','Close')
      },
      error => {
        this.openSnackBar('Task Deletion Failed','Close')
        console.error('Error submitting log entry', error);
      }
    );
  }
  createTask(dataItem?:TaskItem) {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '50%',
      data: dataItem ? dataItem :{}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // You can use result here which is the data returned from the modal
    });
  }
}
