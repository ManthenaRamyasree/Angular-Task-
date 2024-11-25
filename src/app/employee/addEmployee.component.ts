import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { IndexdbService } from '../services/indexdb.service';

@Component({
  selector: 'add-employee',
  templateUrl: './addEmployee.component.html',
  styleUrls: ['./addEmployee.component.css'],
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  isEdit: boolean = false;
  Id;
 

  constructor(
    private formBuilder: FormBuilder,
    private indexdb: IndexdbService,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Id?: string;
      employeeName: string;
      role: string;
      isEdit?: boolean;
      date?: { startDate: string; endDate: string };
      startDate: Date;
      endDate:Date;
    }
  ) {
    this.isEdit = data.isEdit ? true : false;
    this.Id = this.data.Id;
    console.log(this.data)
    this.employeeForm = this.formBuilder.group({
      employeeName: new FormControl(data?.employeeName || '', [
        Validators.required,
      ]),
      role: new FormControl(data?.role || '', [Validators.required]),
      date: this.formBuilder.group({
        startDate: [data?.startDate || '', [Validators.required]],
        endDate: [data?.endDate || '', [Validators.required]]
      })
    });
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;

      if (this.isEdit === true) {
        employeeData.Id = this.Id;
        // Update employee
        this.indexdb.updateEmployee(employeeData).then((result) => {
          this.dialogRef.close('updated');
        });
      } else {
        // Add employee
        this.indexdb.addEmployee(employeeData).then(() => {
          this.dialogRef.close('added');
        });
      }
    }
  }

  //cancel dialog
  cancel() {
    this.dialogRef.close();
  }
}
