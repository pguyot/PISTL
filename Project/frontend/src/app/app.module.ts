import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DomainAdministrationComponent } from './Domain/domain-administration/domain-administration.component';
import { LoginComponent } from './Login/login.component';
import { AppRoutingModule } from './app-routing.module';

import { SysAdminByDomainComponent } from './Domain/sys-admin-by-domain/sys-admin-by-domain.component';
import { SysAdminByDomainDialog } from './Domain/sys-admin-by-domain/sys-admin-by-domain-dialog.component';
import { DomainBySysAdminComponent } from './Domain/domain-by-sys-admin/domain-by-sys-admin.component';
import { DomainBySysAdminComponentDialog } from './Domain/domain-by-sys-admin/domain-by-sys-admin-dialog.component';
import { AccountComponent } from './Account/account.component';
import { TwoFAComponent } from './two-FA/two-fa.component';
import { UsersComponent } from './Users/users.component';
import { DatabaseComponent } from './Infrastructure/database/database.component';
import { ServerComponent } from './Infrastructure/server/server.component';
import { ReportsComponent } from './Reports/reports.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { ServerParameterComponent } from './Infrastructure/server-parameter/server-parameter.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { ErrorPopupComponent } from './utils/error-popup/error-popup.component';
import { ConfirmPopupComponent } from './utils/confirm-popup/confirm-popup.component';
import { InformPopupComponent } from './utils/inform-popup/inform-popup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    DomainAdministrationComponent,
    LoginComponent,
    SysAdminByDomainComponent,
    SysAdminByDomainDialog,
    DomainBySysAdminComponent,
    DomainBySysAdminComponentDialog,
    ServerParameterComponent,
    AccountComponent,
    TwoFAComponent,
    UsersComponent,
    DatabaseComponent,
    ServerComponent,
    ReportsComponent,
    ErrorPopupComponent,
    ConfirmPopupComponent,
    InformPopupComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    DatePipe,
    MatDividerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    CommonModule,
    NgxCsvParserModule,
    MatNativeDateModule,
    MatTabsModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
