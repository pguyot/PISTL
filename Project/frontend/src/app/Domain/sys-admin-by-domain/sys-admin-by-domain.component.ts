import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SysAdminByDomainDialog } from './sys-admin-by-domain-dialog.component'; // Replace with the actual path
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-sys-admin-by-domain',
  templateUrl: './sys-admin-by-domain.component.html',
  styleUrls: ['./sys-admin-by-domain.component.css'],
})
export class SysAdminByDomainComponent implements OnInit {
  domains:  { [domainId: number]: any } = {};
  logins_email: { [loginId: number]: string } = {};
  login_users: { [loginId: number]: any } = {};
  selectedDomain: any;
  displayedColumns: string[] = ['email', 'dev', 'preprod', 'prod', 'test', 'prodcopy', 'staging'];

  dataSource = new MatTableDataSource<any>(); // Remplacez 'any' par le type approprié

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private renderer: Renderer2, private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5050/api/sysadminbydomain').subscribe(
      (data: any) => {
        var login_object = [];

        for (const domain of data.domains) {
          console.log(domain.domainId)
          this.domains[domain.domainId] = domain;
        }
        this.selectedDomain = this.domains[351];

        for (const login of data.logins) {
          this.logins_email[login.loginId] = login.email;
        }
        for (const login of data.logins) {
          login_object = [];
          var tab_users = [];
          for (const user of data.users) {
            if(user.loginId === login.loginId){
              tab_users.push(user);
            }
          }
          if(tab_users.length > 0){
            login_object.push(login.email);
            var user_env = {1: false, 2: false, 3: false, 4: false, 5: false, 6: false};
            for(const user of tab_users){
              for(var i=1; i<7; i++){
                if(user.environment === i){
                  user_env[i] = true;
                }
              }
            }
            login_object.push(user_env);
            login_object.push(tab_users);
          }
          this.login_users[login.loginId] = login_object;
        }
        console.log(this.logins_email);
        console.log(this.login_users);
        console.log(this.login_users[26996])

        this.dataSource.data = Object.values(this.login_users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      (error) => {
        alert('Connection error: ' + error.message);
      }
    );
  }

  onChange(event: any): void {
    this.selectedDomain = event.value;
    console.log(this.selectedDomain);
  }

  onAddedToEnv(user: any, env: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = user;
    console.log('Dialog data:', dialogConfig.data);

    // Open the dialog
    const dialogRef = this.dialog.open(SysAdminByDomainDialog, dialogConfig);
    // Subscribe to the dialog's afterClosed event to handle the result
    console.log(user.environment, env);
    if(user.environment === env){
      user.sysAdmin = !user.sysAdmin;
      // Subscribe to the dialog's afterClosed event to handle the result
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Dialog result:', result);
          this.http.put('http://localhost:5050/api/sysadminbydomain', {
            loginId: result.user.loginId,
            domainId: result.user.domainId,
            userId: result.user.userId,
            environment: result.user.environment,
            sysAdmin: result.user.sysAdmin,
            sysAdminStartDate: result.from,
            sysAdminEndDate: result.to,
            comment: result.comment,
            modifiedBy: 'admin', // TODO: Replace with the actual login
          }).subscribe(
            (data: any) => {
              console.log('Dialog result:', data);
            },
            (error) => {  
              alert('Connection error: ' + error.message);
            }
          );
        }
      });
    }
  }

  // TODO: Open form to add a new sys admin to current domain
  addSysAdmin(): void {
    console.log('Add sys admin');

  }
}
