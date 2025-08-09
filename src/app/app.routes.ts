import { Routes } from '@angular/router';
import { PersonCreate } from './Pages/Persons/person-create/person-create';
import { PersonList } from './Pages/Persons/person-list/person-list';
import { PersonEdit } from './Pages/Persons/person-edit/person-edit';

export const routes: Routes = [{
    path: "",
    component: PersonList
},
{
    path: "create",
    component: PersonCreate
},
{
    path: "edit/:id",
    component: PersonEdit
}
];
