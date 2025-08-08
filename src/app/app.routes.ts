import { Routes } from '@angular/router';
import { PersonCreate } from './Pages/Persons/person-create/person-create';
import { PersonList } from './Pages/Persons/person-list/person-list';

export const routes: Routes = [{
    path: "",
    component: PersonList
}];
