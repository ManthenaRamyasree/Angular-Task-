import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IndexdbService } from 'src/app/services/indexdb.service';
import { AddEmployeeComponent } from '../addEmployee.component';

@Component({
  selector: 'employee-list',
  templateUrl: './list.component.html',
})
export class EmployeeListComponent {
  displayedColumns: string[] = ['name', 'role', 'Start Date', 'End Date', 'edit', 'delete'];
  dataSource: any = [];
  isDataAvailable: boolean = false;
  constructor(private indexdb: IndexdbService, public dialog: MatDialog) {}
  ngOnInit() {
    this.indexdb.employees$.subscribe((employees) => {
      this.dataSource = employees;
      console.log(employees)
      this.isDataAvailable = employees.length > 0;
    });
  }
  openEditDialog(element: any) {
    console.log(element);
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      data: {
        employeeName: element.employeeName,
        role: element.role,
        Id: element.Id,
        startDate:element.date.startDate,
        endDate:element.date.endDate,
        isEdit: true,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        console.log('Employee updated');
      } else if (result === 'added') {
        console.log('New employee added');
      }
    });
  }
  delete(element: any) {
    this.indexdb.deleteEmployee(element.Id);
  }
}
