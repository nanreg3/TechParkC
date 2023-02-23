import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AvisoComponent } from './components/aviso/aviso.component';
import { ListaComponent } from './components/cliente/lista/lista.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';

import { CadastroComponent } from './components/cliente/cadastro/cadastro.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { ClienteService } from './services/cliente.service';


@NgModule({
  declarations: [
    AppComponent,
    AvisoComponent,
    ListaComponent,
    CadastroComponent,
    SidenavComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: AvisoComponent, pathMatch: 'full' },
      { path: 'aviso', component: AvisoComponent },
      { path: 'lista', component: ListaComponent },
      { path: 'cadastro', component: CadastroComponent },
      { path: 'cadastro/:id', component: CadastroComponent },
    ]),
    BrowserAnimationsModule,
    MaterialModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
  bootstrap: [AppComponent]
})
export class AppModule { }
