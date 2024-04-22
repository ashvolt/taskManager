import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { StatusDetails } from 'src/app/shared/types';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.css']
})
export class TaskStatusComponent implements OnInit {

  @Input() UserId =''
  constructor(private service: AppService,private sharedService: SharedService) { }
  statusList: StatusDetails[] = [
    {
      status: "To Do",
      count: 0,
      high: 0,
      low: 0,
      medium: 0
    },
    {
      status: "In Progress",
      count: 0,
      high: 0,
      low: 0,
      medium: 0
    },
    {
      status: "Done",
      count: 0,
      high: 0,
      low: 0,
      medium: 0
    }
  ]
  ngOnInit(): void {
    this.loadStatus()
    this.sharedService.changeEmitted$.subscribe(
      text => {
        if(text = 'loadTasks') {
          this.loadStatus()
        }
      });
  }

  loadStatus() {
    this.service.getStatus(this.UserId).subscribe(
      (resp: any) => {
        this.statusList =resp.data;
      },
      (error: any) => {
        console.error('There was an error retrieving logs', error);
      }
    );
  }
}
