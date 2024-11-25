import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from './employee/addEmployee.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public dialog: MatDialog) {}

  title = 'ang-task';

  openDialog() {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: { isEdit: false },
    });
  }
}
