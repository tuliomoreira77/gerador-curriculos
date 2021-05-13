import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({providedIn: 'root'})
export class FormService {

    constructor(private formBuilder :  FormBuilder) {}

    getForm(formName) {
        if(formName === 'work' || formName === 'education'|| formName === 'extra') return this.getInfoContainerContentForm();
        else {
            console.log(formName)
            return this.getRatingForm();
        }
    }

    getTitleForm() {
        return this.formBuilder.group({
            title: [''],
            subtitle: ['']
        });
    }

    getDetailsForm() {
        return this.formBuilder.group({
            email: [''],
            telefone: ['']
        })
    }

    getRatingForm() {
        return this.formBuilder.group({
            title: [''],
            rate: [Number]
        });
    }

    getProfileForm() {
        return this.formBuilder.group({
            content: ['']
        });
    }

    getInfoContainerContentForm() {
        let form = this.formBuilder.group({
            title: [''],
            startDate: [''],
            endDate: [''],
            content: ['']
        });
        return form;
    }
}