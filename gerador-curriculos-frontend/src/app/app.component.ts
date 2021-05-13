import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormService } from './forms/form-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gerador-curriculos';
  showLoading = false;
  resume:Resume = this.initResume();

  forms = {
    title: this.formService.getTitleForm(),
    profile: this.formService.getProfileForm(),
    work: new FormArray([]),
    education: new FormArray([]),
    extra: new FormArray([]),
    details: this.formService.getDetailsForm(),
    skills: new FormArray([]),
    languages: new FormArray([]),
  }

  constructor(private formService: FormService, private http:HttpClient) {
    this.getFormFromLocalStorage('title');
    this.getFormFromLocalStorage('profile');
    this.getFormFromLocalStorage('work');
    this.getFormFromLocalStorage('education');
    this.getFormFromLocalStorage('extra');
    this.getFormFromLocalStorage('details');
    this.getFormFromLocalStorage('skills');
    this.getFormFromLocalStorage('languages');

    this.generateResume();
  }

  saveFormToLocalStorage() {
    window.localStorage.setItem('title', JSON.stringify(this.forms.title.value));
    window.localStorage.setItem('profile', JSON.stringify(this.forms.profile.value));
    window.localStorage.setItem('work', JSON.stringify(this.forms.work.value));
    window.localStorage.setItem('education', JSON.stringify(this.forms.education.value));
    window.localStorage.setItem('extra', JSON.stringify(this.forms.extra.value));
    window.localStorage.setItem('details', JSON.stringify(this.forms.details.value));
    window.localStorage.setItem('skills', JSON.stringify(this.forms.skills.value));
    window.localStorage.setItem('languages', JSON.stringify(this.forms.languages.value));
  }

  getFormFromLocalStorage(formName) {
    let form = JSON.parse(window.localStorage.getItem(formName));
    this.parseObjectToForm(form, formName);
  }

  parseObjectToForm(form, formName) {
    if(form) {
      if(Array.isArray(form)) {
        for(let formItem of form) {
          let formType = this.formService.getForm(formName);
          try {
            formType.setValue(formItem);
          } catch(err) {}
          this.forms[formName].push(formType);
        }
      } else {
        this.forms[formName].setValue(form);
      }
    }
  }

  addRateItem(formType) {
    this.forms[formType].push(this.formService.getRatingForm());
  }

  removeRateItem(index, formType) {
    this.forms[formType].removeAt(index);
  }

  addWorkItem(formType) {
    this.forms[formType].push(this.formService.getInfoContainerContentForm());
  }

  removeWorkItem(index, formType) {
    this.forms[formType].removeAt(index);
  }

  generateResume() {
    this.resume = this.initResume();
    this.resume.title.title = this.forms.title.value.title;
    this.resume.title.subtitle = this.forms.title.value.subtitle;
    this.resume.profile.content = this.forms.profile.value.content;
    this.resume.details.email = this.forms.details.value.email;
    this.resume.details.telefone = this.forms.details.value.telefone;
    this.parseContentForm(this.resume.work, this.forms.work);
    this.parseContentForm(this.resume.education, this.forms.education);
    this.parseContentForm(this.resume.extra, this.forms.extra);
    this.parseRatingForm(this.resume.skills, this.forms.skills);
    this.parseRatingForm(this.resume.languages, this.forms.languages);

    this.saveFormToLocalStorage();
  }

  parseContentForm(object:any[],formArray:FormArray) {
    for(let form of formArray.controls) {
      let item = {title: '', startDate: '', endDate: '', content: ''};
      item.title = form.value.title
      item.startDate = form.value.startDate;
      item.endDate = form.value.endDate;
      item.content = form.value.content;
      object.push(item);
    }
  }

  parseRatingForm(object:any[],formArray:FormArray) {
    for(let form of formArray.controls) {
      object.push({title: form.value.title, rate: (form.value.rate*100/4)});
    }
  }

  async generatePdf() {
    this.showLoading = true;
    let html = document.getElementById('print-section').outerHTML;
    let cssFile = await this.http.get('/assets/cssfile.css', {responseType: "text"}).toPromise();
    let fontCss = "<link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>";
    let fontAwesome1 = "<link href='https://use.fontawesome.com/releases/v5.15.3/css/all.css' rel='stylesheet' type='text/css'>";
    let fontAwesome2 = "<link href='https://use.fontawesome.com/releases/v5.15.3/css/v4-shims.css' rel='stylesheet' type='text/css'>";
    html = `<html><head>${fontCss}${fontAwesome1}${fontAwesome2}<style>${cssFile}</style></head><body><div>${html}</div></body></html>`
    let response = await this.http.post<any>('https://api.alcateiaufsj.com.br/v1/generate/pdf', {html: html}).toPromise();
    const source = `data:application/pdf;base64,${response.pdf}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `curriculo.pdf`
    link.click();
    this.showLoading = false;
  }

  initResume() {
    return {
      title: {
        title: '',
        subtitle: '',
      },
      profile: {
        content: '',
      },
      work: [],
      education: [],
      extra: [],
      details:{
        email: '',
        telefone: '',
      },
      skills: [],
      languages: [],
    
    };
  }
}

interface Resume {
  title: {
    title: string,
    subtitle: string,
  },
  profile: {
    content: string,
  },
  work: {
    title: string,
    startDate: string,
    endDate: string,
    content: string,
  }[],
  education: {
    title: string,
    startDate: string,
    endDate: string,
    content: string,
  }[],
  extra: {
    title: string,
    startDate: string,
    endDate: string,
    content: string,
  }[],
  details: {
    email: string,
    telefone: string,
  },
  skills: string[],
  languages: string[],

}
