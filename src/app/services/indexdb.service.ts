import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexdbService {
  private db!: IDBPDatabase<MyDb>;
  private employeesSubject = new BehaviorSubject<any[]>([]); // to update employee list
  employees$ = this.employeesSubject.asObservable();
  constructor() {
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB<MyDb>('my-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('user-store')) {
          db.createObjectStore('user-store', {
            keyPath: 'Id', //'employeeId'
            autoIncrement: true, // Automatically generate keys
          });
        }
      },
    });
  }

  // Add Employee
  addEmployee(employee: { employeeName: string; role: string; id?: string }) {
    return this.db.add('user-store', employee).then((id) => {
      this.getEmployee(); // immediately to show in employee list
    });
  }

  // Get Employee List
  getEmployee() {
    this.db.getAll('user-store').then((employees) => {
      this.employeesSubject.next(employees); //update list of employees
    });
  }

  // Update/Edit Employee
  updateEmployee(updatedEmployee: {
    Id: string;
    employeeName: string;
    role: string;
  }) {
    return new Promise<void>((resolve, reject) => {
      const transaction = this.db.transaction('user-store', 'readwrite');
      const store = transaction.objectStore('user-store');

      // Retrieve the employee by Id using the `get` method
      const request = store.get(updatedEmployee.Id);
      request
        .then((existingEmployee) => {
          if (existingEmployee) {
            // Merge updated employee data with existing employee list
            const updatedData = { ...existingEmployee, ...updatedEmployee };

            // Put the updated data back into the store
            store
              .put(updatedData)
              .then(() => {
                console.log('Employee updated successfully');
                this.getEmployee(); // Refresh the employee list after update
                resolve(); // Resolve the promise on success
              })
              .catch((err) => {
                console.error('Error updating employee:', err);
                reject('Error updating employee: ' + err); // Reject the promise if update fails
              });
          } else {
            console.log('Employee not found');
            reject('Employee not found'); // Reject the promise if employee not found
          }
        })
        .catch((err) => {
          console.error('Error fetching employee for update:', err);
          reject('Error fetching employee for update: ' + err); // Reject the promise if fetching fails
        });
    });
  }

  // Delete Employee
  deleteEmployee(Id: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const transaction = this.db.transaction('user-store', 'readwrite');
        const store = transaction.objectStore('user-store');

        // Fetch the employee by Id
        const getRequest = store.get(Id);
        const existingEmployee = await getRequest;

        if (existingEmployee) {
          // Proceed to delete the employee
          const deleteRequest = store.delete(Id);
          console.log('Employee deleted successfully');
          this.getEmployee(); // Refresh the employee list
          resolve(); // Resolve the promise
        } else {
          console.log('Employee not found');
          reject('Employee not found'); // Reject if the record is not found
        }
      } catch (error) {
        console.error('Unexpected error occurred:', error);
        reject(`Unexpected error occurred: ${error}`);
      }
    });
  }
}

interface MyDb extends DBSchema {
  'user-store': {
    key: string;
    value: { Id?: string; employeeName: string; role: string };
  };
}
