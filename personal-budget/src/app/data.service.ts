// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//     providedIn: 'root'
// })
// export class DataService {
//     private data: any;

//     constructor(private http: HttpClient) { }

//     getData(): any {
//         if (!this.data) {
//             this.fetchData();
//         }
//         return this.data;
//     }

//     private fetchData(): void {
//         // Make the HTTP call to the backend API
//         this.http.get('http://localhost:3000/budget').subscribe((response: any) => {
//             this.data = response;
//         });
//     }
// }




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private myBudgetSubject = new BehaviorSubject<any>(null);
  myBudget$ = this.myBudgetSubject.asObservable();

  private newBudgetSubject = new BehaviorSubject<any>(null);
  newBudget$ = this.newBudgetSubject.asObservable();

  constructor(private http: HttpClient) {}  

  getMyBudget(): void {
    if (!this.myBudgetSubject.getValue()) {
      this.http.get<any>('http://localhost:3000/budget').subscribe(data => {
        this.myBudgetSubject.next(data.myBudget);
      });
    }
  }

  getNewBudget(): void {
    if (!this.newBudgetSubject.getValue()) {
      this.http.get<any>('http://localhost:3000/newbudget').subscribe(data => {
        this.newBudgetSubject.next(data);
      });
    }
  }
}
