import { Routes } from '@angular/router';
import { DestinoComponent } from './componentes/destino/destino.component';
import { ReservaComponent } from './componentes/reserva/reserva.component';
import { LoginComponent } from './componentes/login/login.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';

export const routes: Routes = [
    { path: '', redirectTo: 'destino', pathMatch: 'full' },
    { path: 'destino',        component: DestinoComponent},
    { path: 'reserva',        component: ReservaComponent},
    { path: 'login',        component: LoginComponent},
    { path: 'clientes',        component: ClientesComponent},
];
