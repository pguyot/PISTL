import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  // Users form the DB
  users: any;

  // Table used for data display
  dataSource: any;

  // Paginator used for the table
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Sort used for the table
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // Columns names in the table
  displayedColumns: string[] = ['email', 'DAT'];

  // Bool used for the 'Edit', 'Delete', 'Reset Password' and 'Unlock' buttons
  isClicked: boolean = false;

  // Bool that allows or not the display of the create a new user form
  showFormCreate: boolean = false;

  // Form data used to create a new user
  formDataCreate = {
    name: '',
    email: '',
    phone: '',
    modifiedBy: '',
    DATEnabled: false,
    locked: false,
  };

  // User selected in the table
  userSelected = {
    name: '',
    email: '',
    phone: '',
    lastLoginDate: '',
    invalidAttemptCount: '',
    modifiedBy: '',
    passwordModifiedDate: '',
    createdDate: '',
    DATEnabled: false,
    locked: false,
  };

  // Copy of the user selected in the table (for the 'Save' button)
  userSelectedCopy = {
    phone: '',
    DATEnabled: false,
    locked: false,
  };

  // Hover the two columns in the table
  isHovered: boolean = false;

  // User hovered in the table
  userHovered: string = '';

  // Bool used to activate the 'Edit' button
  editEnabled: boolean = false;

  // Bool used to display the delete confirmation popup
  showDeleteConfirmation: boolean = false;

  // Bool used to display the reset password confirmation popup
  showResetPasswordConfirmation: boolean = false;

  // Confirmation message to display
  confirmationMessage: string = '';

  // Password reseted
  passwordReseted: string = '';

  // Bool used to display the information popup
  showInformPopup: boolean = false;

  // Bool that allows or not to display the information below the form
  showInform: boolean = false;

  // Bool that allows or not to display the error popup
  showPopupError: boolean = false;

  // Error message to display in the popup
  popupMessage: string = '';

  /***************************************************************************************/
  /**
   * Creates an instance of UsersComponent.
   * @param renderer - The renderer used to create the users page.
   * @param http - The http client used to connect to the database.
   */
  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    let JWTToken = localStorage.getItem('token');
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JWTToken,
        'Content-Type': 'application/json',
      }),
    };

    this.http.get('http://localhost:5050/api/users', options).subscribe(
      (data: any) => {
        this.users = data.users;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'DAT':
              return item.datenabled ? true : false;
            default:
              return item[property];
          }
        };
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error(error.error);
      }
    );
  }

  /***************************************************************************************/
  /**
   * Function used to display the user's information in the form.
   */
  showFormCreateUser() {
    this.showFormCreate = !this.showFormCreate;

    // Reinitialize the form if reclicked
    this.formDataCreate = {
      name: '',
      email: '',
      phone: '',
      modifiedBy: '',
      DATEnabled: false,
      locked: false,
    };

    this.reinitaliseUserSelectedForm();

    this.showInform = false;
  }

  /***************************************************************************************/
  /**
   * Function used to POST the user's information from the form.
   */
  newUserFormCreateUser() {
    this.showInform = false;
    // if (
    //   this.formDataCreate.name == '' ||
    //   this.formDataCreate.email == '' ||
    //   this.formDataCreate.phone == ''
    // ) {
    //   this.showErrorPopup('Please fill all the fields.');
    //   return;
    // }

    this.formDataCreate.modifiedBy = localStorage.getItem('email');

    let JWTToken = localStorage.getItem('token');

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JWTToken,
        'Content-Type': 'application/json',
      }),
    };

    this.http
      .post(
        'http://localhost:5050/api/users/create',
        this.formDataCreate,
        options
      )
      .subscribe({
        next: (data: any) => {
          this.users = data.users;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'DAT':
                return item.datenabled ? true : false;
              default:
                return item[property];
            }
          };
          this.dataSource.sort = this.sort;
          this.showFormCreateUser();
        },
        error: (error: any) => {
          console.error(error.error.message);
        },
      });
  }

  /***************************************************************************************/
  /**
   * Function used to display activate the error popup.
   * @param message - Error message.
   */
  showErrorPopup(message: string) {
    this.showPopupError = true;
    this.popupMessage = message;
  }

  /***************************************************************************************/
  /**
   * Function used to close the error popup.
   */
  closeErrorPopup() {
    this.showPopupError = false;
  }

  /***************************************************************************************/
  getUser(user: any) {
    this.userSelected.email = user.email;
    this.userSelected.name = user.name;
    this.userSelected.phone = user.phone;
    this.userSelected.lastLoginDate = user.lastLoginDate;
    this.userSelected.invalidAttemptCount = user.invalidAttemptCount;
    this.userSelected.modifiedBy = user.modifiedBy;
    this.userSelected.passwordModifiedDate = user.passwordModifiedDate;
    this.userSelected.createdDate = user.createdDate;
    this.userSelected.DATEnabled = user.datenabled;
    this.userSelected.locked = user.termsAccepted;

    this.reinitaliseUserCreatedForm();

    // Activate the 'Edit', 'Delete', 'Reset Password' and 'Unlock' buttons
    this.isClicked = true;
  }

  /***************************************************************************************/
  /**
   * Function used to activate the hover.
   */
  onMouseEnter(userHovered: string) {
    this.isHovered = true;
    this.userHovered = userHovered;
  }

  /***************************************************************************************/
  /**
   * Function used to deactivate the hover.
   */
  onMouseLeave() {
    this.isHovered = false;
    this.userHovered = '';
  }

  /***************************************************************************************/
  /**
   * Function used to reinitalise the selected Sys Admin.
   */
  reinitaliseUserSelectedForm() {
    // Disable access user form
    this.userSelected = {
      name: '',
      email: '',
      phone: '',
      lastLoginDate: '',
      invalidAttemptCount: '',
      modifiedBy: '',
      passwordModifiedDate: '',
      createdDate: '',
      DATEnabled: false,
      locked: false,
    };

    // Disable the 'Edit', 'Delete', 'Reset Password' and 'Unlock' buttons
    this.isClicked = false;

    // Disable the 'Edit' button
    this.editEnabled = false;

    // Close the unlok inform confirmation
    this.showInform = false;
  }

  /***************************************************************************************/
  /**
   * Function used to reinitalise the created Sys Admin form.
   */
  reinitaliseUserCreatedForm() {
    this.showFormCreate = false;

    this.formDataCreate = {
      name: '',
      email: '',
      phone: '',
      modifiedBy: '',
      DATEnabled: false,
      locked: false,
    };
  }

  /***************************************************************************************/
  /**
   * Function used to enable the a Sys Admin edition.
   */
  editEnable() {
    this.editEnabled = true;

    // Copy the user selected to compare the changes
    this.userSelectedCopy.phone = this.userSelected.phone;
    this.userSelectedCopy.DATEnabled = this.userSelected.DATEnabled;
    this.userSelectedCopy.locked = this.userSelected.locked;

    this.showInform = false;
  }

  /***************************************************************************************/
  /**
   * Function used to edit the Sys Admin's information.
   */
  editUser() {
    // if (
    //   this.userSelected.phone == this.userSelectedCopy.phone &&
    //   this.userSelected.DATEnabled == this.userSelectedCopy.DATEnabled &&
    //   this.userSelected.locked == this.userSelectedCopy.locked
    // ) {
    //   this.showErrorPopup('Please do some changes before Save.');
    //   return;
    // }

    this.showInform = false;

    let JWTToken = localStorage.getItem('token');

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JWTToken,
        'Content-Type': 'application/json',
      }),
    };

    const requestBody = {
      email: this.userSelected.email,
      phone: this.userSelected.phone,
      datenabled: this.userSelected.DATEnabled,
      termsAccepted: this.userSelected.locked,
    };

    this.http
      .post('http://localhost:5050/api/users/edit', requestBody, options)
      .subscribe({
        next: (data: any) => {
          this.users = data.users;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.editEnabled = false;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'DAT':
                return item.datenabled ? true : false;
              default:
                return item[property];
            }
          };
          this.dataSource.sort = this.sort;
        },
        error: (error: any) => {
          console.error(error.error.message);
        },
      });
  }

  /***************************************************************************************/
  /**
   * Function used to open the Delete user confirmation popup.
   */
  openDeleteConfirmation() {
    this.showDeleteConfirmation = true;
    this.confirmationMessage =
      'Are you sure you want to delete this user: ' +
      this.userSelected.email +
      '?';
  }

  /***************************************************************************************/
  /**
   * Function used to call the POST request to delete the user.
   */
  onDeleteConfirm() {
    this.showDeleteConfirmation = false;

    if (this.userSelected.email == localStorage.getItem('email')) {
      this.showErrorPopup('You cannot delete yourself!');
      return;
    }

    let JWTToken = localStorage.getItem('token');

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JWTToken,
        'Content-Type': 'application/json',
      }),
    };

    const requestBody = {
      email: this.userSelected.email,
      phone: this.userSelected.phone, // Not used
      datenabled: this.userSelected.DATEnabled, // Not used
      termsAccepted: this.userSelected.locked, // Not used
    };
    console.log(requestBody);
    this.http
      .post('http://localhost:5050/api/users/delete', requestBody, options)
      .subscribe({
        next: (data: any) => {
          this.users = data.users;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'DAT':
                return item.datenabled ? true : false;
              default:
                return item[property];
            }
          };
          this.dataSource.sort = this.sort;
          this.reinitaliseUserSelectedForm();
        },
        error: (error: any) => {
          console.error(error.error.message);
        },
      });
  }

  /***************************************************************************************/
  /**
   * Function used to close the delete confirmation popup.
   */
  onDeleteClose() {
    this.showDeleteConfirmation = false;
  }

  /***************************************************************************************/
  /**
   * Function used to open the Reset Password confirmation popup.
   */
  openResetPasswordConfirmation() {
    this.showResetPasswordConfirmation = true;
    this.confirmationMessage =
      'Are you sure you want to reset the password of this user: ' +
      this.userSelected.email +
      '?';
  }

  /***************************************************************************************/
  /**
   * Function used to call the POST request to reset the password.
   */
  onResetPasswordConfirm() {
    this.onResetPasswordClose();

    let JWTToken = localStorage.getItem('token');

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JWTToken,
        'Content-Type': 'application/json',
      }),
    };

    const requestBody = {
      email: this.userSelected.email,
      phone: this.userSelected.phone, // Not used
      datenabled: this.userSelected.DATEnabled, // Not used
      termsAccepted: this.userSelected.locked, // Not used
      modifiedBy: localStorage.getItem('email'),
    };

    this.http
      .post(
        'http://localhost:5050/api/users/reset-password',
        requestBody,
        options
      )
      .subscribe({
        next: (data: any) => {
          this.users = data.users;
          this.dataSource = new MatTableDataSource(this.users);
          this.confirmationMessage =
            'The password has been reset for the user [' +
            this.userSelected.email +
            '] and is now: ';
          this.passwordReseted = data.password;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'DAT':
                return item.datenabled ? true : false;
              default:
                return item[property];
            }
          };
          this.dataSource.sort = this.sort;
          this.reinitaliseUserSelectedForm();
          this.show_inform_popup(this.confirmationMessage);
        },
        error: (error: any) => {
          console.error(error.error.message);
        },
      });
  }

  /***************************************************************************************/
  /**
   * Function used to close the Reset Password confirmation popup.
   */
  onResetPasswordClose() {
    this.showResetPasswordConfirmation = false;
  }

  /***************************************************************************************/
  /**
   * Function used to display activate the inform popup.
   * @param message - Error message.
   */
  show_inform_popup(message: string) {
    this.popupMessage = message;
    this.showInformPopup = true;
  }

  /***************************************************************************************/
  /**
   * Function used to close the inform popup.
   */
  close_inform_popup() {
    this.showInformPopup = false;
    this.popupMessage = '';
    this.passwordReseted = '';
  }

  /***************************************************************************************/
  check_if_user_blocked() {
    let JWTToken = localStorage.getItem('token');

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + JWTToken,
        'Content-Type': 'application/json',
      }),
    };

    const requestBody = {
      email: this.userSelected.email,
      phone: this.userSelected.phone, // Not used
      datenabled: this.userSelected.DATEnabled, // Not used
      termsAccepted: this.userSelected.locked, // Not used
      modifiedBy: localStorage.getItem('email'),
    };

    this.http
      .post('http://localhost:5050/api/users/unlock-user', requestBody, options)
      .subscribe({
        next: (data: any) => {
          this.users = data.users;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'DAT':
                return item.datenabled ? true : false;
              default:
                return item[property];
            }
          };
          this.dataSource.sort = this.sort;
          this.update_user_selected();
          this.confirmationMessage =
            'User [' + this.userSelected.email + '] is now unlocked.';
          this.showInform = true;
        },
        error: (error: any) => {
          console.error(error.error.message);
        },
      });
  }

  /***************************************************************************************/
  /**
   * Function used to update the user selected after Unlock POST request.
   */
  update_user_selected() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email == this.userSelected.email) {
        this.userSelected.name = this.users[i].name;
        this.userSelected.email = this.users[i].email;
        this.userSelected.phone = this.users[i].phone;
        this.userSelected.lastLoginDate = this.users[i].lastLoginDate;
        this.userSelected.invalidAttemptCount =
          this.users[i].invalidAttemptCount;
        this.userSelected.modifiedBy = this.users[i].modifiedBy;
        this.userSelected.passwordModifiedDate =
          this.users[i].passwordModifiedDate;
        this.userSelected.createdDate = this.users[i].createdDate;
        this.userSelected.DATEnabled = this.users[i].datenabled;
        this.userSelected.locked = this.users[i].termsAccepted;
      }
    }
  }
}
/***************************************************************************************/
/***************************************************************************************/
/***************************************************************************************/
