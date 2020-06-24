import { MemoryManager } from "../services/memory-manager.js";
import { FieldTextEmail, FieldNumber, FieldDate, FieldCheckbox, FieldTextarea, FieldRadio, FieldSelect, Field } from './fields.js';
import { fieldsModel } from '../config/field-model.js';
import { Validate } from "../services/validations.js";
import { Anuncio_Mascota } from '../config/datos-modelo.js';
import { eType } from '../config/interfaces.js';
/**
 * Administra el componente Form
 */
export class Form {

    constructor() {
        this.fields = []
        this.formElement = document.querySelector(".form") as HTMLElement & Anuncio_Mascota;
        this.btnNewElement = document.getElementById("btnNew") as HTMLButtonElement;
        this.titleElement = document.getElementById("formTitle") as HTMLElement;
        this.fieldContElement = document.querySelector(".fieldContainer") as HTMLElement;
        this.renderFields();
        this.setButons();
        this.isEdit = false;
    }
    formElement: HTMLElement & Anuncio_Mascota;
    fieldContElement: HTMLElement;
    fields: Field[];
    btnNewElement: HTMLButtonElement;
    titleElement: HTMLElement;
    isEdit: Boolean;

    // #region Form
    formOpen() {
        Validate.cleanErrors();
        this.formElement.classList.remove("close");
        this.btnNewElement.disabled = true;
    }
    formClose() {
        this.formElement.classList.add("close");
        this.formElement.classList.remove("edit");
        this.btnNewElement.disabled = false;

    }
    newDataInForm() {
        this.cleanFormValues();
        this.formOpen();
        this.formElement.setAttribute("style", `top: 0;`);
        this.titleElement.innerHTML = `<i class='fas fa-plus'></i> Nuevo anuncio`;
        this.formElement.classList.remove("edit");
        document.getElementById("btnSubmit").innerHTML = `<i class="fas fa-save"></i> Guardar nuevo`;
        document.getElementById("btnRemove").classList.add("hidden");
        this.addIconAndDefaults();
        this.isEdit = false;
    }
    addIconAndDefaults() {
        // this.formElement.transaccion.value = "venta";
        (document.querySelector(".form #transaccion") as HTMLInputElement).value = "venta";

        let lVaElement: HTMLElement = document.getElementById("label_vacunas") as HTMLElement;
        let lvaText: string = lVaElement.innerText;
        lVaElement.innerHTML = `<i class="fas fa-syringe"></i> ${lvaText}`;

        let lFeElement: HTMLElement = document.getElementById("label_fecha_de_nacimiento") as HTMLElement;
        let lFeText: string = lFeElement.innerText;
        lFeElement.innerHTML = `<i class="fas fa-birthday-cake"></i> ${lFeText}`;

        let lRaElement: HTMLElement = document.getElementById("label_raza") as HTMLElement;
        let lRText: string = lRaElement.innerText;
        lRaElement.innerHTML = `<i class="fas fa-paw"></i> ${lRText}`;
    }
    // editDataInForm(id, trElement) {
    editDataInForm(index: number, topPosition: number) {
        this.cleanFormValues();
        let formData = MemoryManager.instance.data[index];
        this.populateFormValues(formData)

        this.formOpen();
        this.formElement.setAttribute("style", `top: ${topPosition - 25}px;`);
        this.formElement.classList.add("edit");
        this.titleElement.innerHTML = `<i class='fas fa-edit'></i> Editar anuncio ${formData.id}`;
        document.getElementById("btnSubmit").innerHTML = `<i class="fas fa-save"></i> Guardar cambios`;
        document.getElementById("btnRemove").classList.remove("hidden");
        // this.addIconAndDefaults();
        this.isEdit = true;
    }
    cancelEditDataInForm() {
        this.formClose();
        let rows: Element[] = [...document.querySelectorAll("tbody tr")];
        for (let row of rows) {
            row.classList.remove("active");
        }
    }
    populateFormValues(formData: any) {
        for (let fm of fieldsModel) {
            try {
                switch (fm.type) {
                    case eType.radio:
                        fm.options.forEach(opt => {
                            let id = opt.value.toLowerCase().split(' ').join('_').split('-').join('');
                            let element: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                            element.checked = (formData[fm.nombre] == element.value)
                        });
                        break;
                    case eType.select:
                        fm.options.forEach(opt => {
                            let id = opt.value.toLowerCase().split(' ').join('_').split('-').join('');
                            let element: HTMLOptionElement = document.getElementById(id) as HTMLOptionElement;
                            element.selected = (formData[fm.nombre] == element.value) ? formData[fm.nombre] : undefined
                         
                        });
                        break;
                    case eType.checkbox:
                        let element: HTMLInputElement = document.getElementById(fm.nombre) as HTMLInputElement
                        element.checked = JSON.parse(formData[fm.nombre]);
                        break;

                    default:
                        (document.getElementById(fm.nombre) as HTMLInputElement).value = formData[fm.nombre];
                        break;
                }
            } catch (error) {
                console.error("error populateFormValues() en id: " + fm.nombre);
                console.error(error);
            }
        }
        // }
    }
    readFormValues(): Anuncio_Mascota & any {
        let request = {}
        for (let fm of fieldsModel) {
            let value: any = "";
            let keyValue;
            try {
                switch (fm.type) {
                    case "radio":
                        fm.options.forEach(opt => {
                            let id = opt.value.toLowerCase().split(' ').join('_').split('-').join('');
                            let element: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                            if (element.checked) {
                                value = element.value;
                            }
                        });
                        break;

                    case "select":
                        value = (document.getElementById(fm.nombre) as HTMLSelectElement).value
                        break;

                    case "checkbox":
                        value = (document.getElementById(fm.nombre) as HTMLInputElement).checked;
                        break;

                    case "number":
                        value = parseInt((document.getElementById(fm.nombre) as HTMLInputElement).value);
                        break;

                    default:
                        value = (document.getElementById(fm.nombre) as HTMLInputElement).value;
                        break;
                }
                keyValue = { [fm.nombre]: value };
                request = { ...request, ...keyValue };
            } catch (error) {
                console.error("error readFormValues() en id: " + fm.nombre + " " + value);
                console.error(error);
            }
        }
        return request;

    }
    cleanFormValues(cleanID = true): void {
        for (let fm of fieldsModel) {
            if (!(!cleanID && fm.nombre == "id")) {
                try {
                    switch (fm.type) {
                        case "radio":
                            fm.options.forEach(opt => {
                                let id = opt.value.toLowerCase().split(' ').join('_').split('-').join('');
                                let element:HTMLInputElement = document.getElementById(id) as HTMLInputElement;
                                element.checked = false;
                            });
                            break;

                        case "checkbox":
                            (document.getElementById(fm.nombre) as HTMLInputElement).checked = false;
                            break;

                        default:
                            (document.getElementById(fm.nombre) as HTMLInputElement).value = "";
                            break;
                    }
                } catch (error) {
                    console.error("error cleanFormValues() en id: " + fm.nombre);
                    console.error(error);
                }
            }
        }
    }
    // #endregion

    // #region Fields
    renderFields() {
        fieldsModel.forEach(field => {
            let fInst;
            switch (field.type) {
                case "number":
                    fInst = new FieldNumber(field.nombre, field.placeholder, field.isRequired, field.isDisabled, field.isVisible, field.min as number, field.max as number);
                    break;
                case "date":
                    fInst = new FieldDate(field.nombre, field.placeholder, field.isRequired, field.isDisabled, field.isVisible, field.min as string, field.max as string);
                    break;
                case "checkbox":
                    fInst = new FieldCheckbox(field.nombre, field.placeholder, field.isRequired, field.isDisabled, field.isVisible);
                    break;
                case "textarea":
                    fInst = new FieldTextarea(field.nombre, field.placeholder, field.isRequired, field.isDisabled, field.isVisible, field.rows);
                    break;
                case "radio":
                    fInst = new FieldRadio(field.nombre, field.placeholder, field.isRequired, field.isDisabled, field.isVisible, field.options);
                    break;
                case "select":
                    fInst = new FieldSelect(field.nombre, field.placeholder, field.isRequired, field.isDisabled, field.isVisible, field.options);
                    break;

                default:
                    fInst = new FieldTextEmail(field.nombre, field.placeholder, field.isRequired, field.isDisabled, field.isVisible, field.type, field.maxlength);
                    break;
            }
            this.fields.push(fInst);
            this.fieldContElement.appendChild(fInst.element);
        });
        console.log("%cFields instances: ", "color: green", this.fields)
    }
    // #endregion

    // #region Buttons
    setButons() {
        // this.formElement.onclick = this.onSubmit;
        document.getElementById("btnSubmit").onclick = this.onSubmit;
        document.getElementById("btnRemove").onclick = this.onRemove;
        document.getElementById("btnClear").onclick = this.onClear;
        document.getElementById("btnCancel").onclick = this.onCancel;
        document.getElementById("btnCancelX").onclick = this.onCancel;
        document.getElementById("btnNew").onclick = this.onNew;
    }
    onNew() {
        MemoryManager.instance.formInstance.newDataInForm();
    }
    onSubmit() {
        event.preventDefault();
        MemoryManager.instance.saveEditData();
    }
    onRemove() {
        event.preventDefault();
        if (confirm("¿Esta seguro que desea eliminar los datos?"))
            MemoryManager.instance.removeData();
    }
    onCancel() {
        event.preventDefault();
        MemoryManager.instance.formInstance.cancelEditDataInForm();
    }
    onClear() {
        event.preventDefault();
        if (confirm("¿Esta seguro que desea vaciar los campos?"))
            MemoryManager.instance.formInstance.cleanFormValues(false);
    }
    // #endregion



}