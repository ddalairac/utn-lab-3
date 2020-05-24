/** Field de texto o email
 * nombre, type, placeholder, isRequired
    *  @param nombre: string.
    *  @param placeholder: string.
    *  @param isRequired: boolean.
    *  @param isDisabled: boolean.
 */
export class Field {
    constructor(nombre, placeholder = "", isRequired = false, isDisabled = false, isVisible = true) {
        if (!nombre) {
            throw "El nombre del field no definido";
        }
        this.nombre = nombre;
        this.label = nombre.toLowerCase().split('_').join(' ');
        this.label = this.label.charAt(0).toUpperCase() + this.label.slice(1);
        this.placeholder = placeholder;
        this.isRequired = isRequired;
        this.isDisabled = isDisabled;
        this.isVisible = isVisible;
    }
    element;

    label;
    nombre;
    type;
    placeholder;
    isRequired;
    isDisabled;
    isVisible;

    createFieldElement() {
        let fieldEl = document.createElement('div');
        fieldEl.setAttribute("id", `field_${this.nombre}`)
        fieldEl.classList.add("field");
        if (!this.isVisible) fieldEl.classList.add("hidden");

        return fieldEl;
    }
}
export class FieldTextEmail extends Field {
    constructor(nombre, placeholder, isRequired, isDisabled, isVisible, type = "text", maxlength = 0) {
        super(nombre, placeholder, isRequired, isDisabled, isVisible);
        this.type = type;
        this.maxlength = maxlength;
        this.renderField();
    }
    maxlength;
    renderField() {
        let fieldEl = this.createFieldElement();
        let maxlength = this.maxlength ? `maxlength=${this.maxlength}` : '';
        fieldEl.innerHTML = `
        <label for="${this.nombre}">${this.label}</label>
        <input id="${this.nombre}" type="${this.type}" name="${this.nombre}" placeholder="${this.placeholder}" ${maxlength}>
        <span id="error_${this.nombre}" class="error-msj">error del campo</span>`;

        let inputEl = fieldEl.childNodes[3];
        inputEl.disabled = this.isDisabled;
        inputEl.required = this.isRequired;

        this.element = fieldEl;
    }
}
export class FieldNumber extends Field {
    constructor(nombre, placeholder, isRequired, isDisabled, isVisible, min, max) {
        super(nombre, placeholder, isRequired, isDisabled, isVisible);
        this.min = min;
        this.max = max;
        this.renderField();
    }
    min;
    max;
    renderField() {
        let fieldEl = this.createFieldElement();
        let minimo
        let maximo
        if (this.min != undefined)
            minimo = `min=${this.min}`
        else
            minimo = '';
        if (this.max != undefined)
            maximo = `max=${this.max}`
        else
            maximo = '';
        fieldEl.innerHTML = `
        <label for="${this.nombre}">${this.label}</label>
        <input id="${this.nombre}" type="number" name="${this.nombre}" placeholder="${this.placeholder}" ${minimo} ${maximo}>
        <span id="error_${this.nombre}" class="error-msj">error del campo</span>`;

        let inputEl = fieldEl.childNodes[3];
        inputEl.disabled = this.isDisabled;
        inputEl.required = this.isRequired;

        this.element = fieldEl;
    }
}
export class FieldCheckbox extends Field {
    constructor(nombre, placeholder, isRequired, isDisabled, isVisible) {
        super(nombre, placeholder, isRequired, isDisabled, isVisible);
        this.renderField();
    }
    renderField() {
        let fieldEl = this.createFieldElement();
        fieldEl.classList.add("checkbox");

        fieldEl.innerHTML = `
        <p>${this.label}</p>
        <input id="${this.nombre}" type="checkbox" name="${this.nombre}">
        <label for="${this.nombre}">${this.placeholder}</label>
        <span id="error_${this.nombre}" class="error-msj">error del campo</span>`;

        let inputEl = fieldEl.childNodes[3];
        inputEl.disabled = this.isDisabled;
        inputEl.required = this.isRequired;

        this.element = fieldEl;
    }
}
export class FieldTextarea extends Field {
    constructor(nombre, placeholder, isRequired, isDisabled, isVisible, rows = 0) {
        super(nombre, placeholder, isRequired, isDisabled, isVisible);
        this.rows = rows;
        this.renderField();
    }
    rows;
    renderField() {
        let fieldEl = this.createFieldElement();
        fieldEl.classList.add("w-100");
        let rows = this.rows ? `rows="${this.rows}"` : '';
        fieldEl.innerHTML = `
        <label for="${this.nombre}">${this.label}</label>
        <textarea id="${this.nombre}"${this.placeholder}  type="checkbox" name="${this.nombre}" ${rows} ></textarea>
        <span id="error_${this.nombre}" class="error-msj">error del campo</span>`;

        let inputEl = fieldEl.childNodes[3];
        inputEl.disabled = this.isDisabled;
        inputEl.required = this.isRequired;

        this.element = fieldEl;
    }
}
export class FieldDate extends Field {
    constructor(nombre, placeholder, isRequired, isDisabled, isVisible, min = '', max = '') {
        super(nombre, placeholder, isRequired, isDisabled, isVisible);
        this.min = min;
        this.max = max;
        this.renderField();
    }
    min;
    max;
    renderField() {
        let fieldEl = this.createFieldElement();
        let minimo = this.min ? `min="${this.min}"` : '';
        let maximo = this.max ? `max="${this.max}"` : '';
        fieldEl.innerHTML = `
        <label for="${this.nombre}">${this.label}</label>
        <input id="${this.nombre}" type="date" name="${this.nombre}" placeholder="${this.placeholder}" ${minimo} ${maximo}>
        <span id="error_${this.nombre}" class="error-msj">error del campo</span>`;

        let inputEl = fieldEl.childNodes[3];
        inputEl.disabled = this.isDisabled;
        inputEl.required = this.isRequired;

        this.element = fieldEl;
    }
}
export class FieldRadio extends Field {
    constructor(nombre, placeholder, isRequired, isDisabled, isVisible, options = [""]) {
        super(nombre, placeholder, isRequired, isDisabled, isVisible);
        this.options = options;
        this.renderField();
    }
    options;
    renderField() {
        let fieldEl = this.createFieldElement();
        fieldEl.classList.add("radio");

        let disabled = this.isDisabled ? `disabled` : '';
        let required = this.isRequired ? `required` : '';
        let optionsElements = "";
        this.options.forEach(option => {
            optionsElements += `
            <input type="radio" id="${option}" name="${this.nombre}" value="${option}" ${disabled} ${required}>
            <label for="${option}">${option.toLowerCase().split('_').join(' ')}</label>`
        });
        fieldEl.innerHTML = `
                <p>${this.label}</p>
                ${optionsElements}
                <span id="error_${this.nombre}" class="error-msj">error del campo</span>`;
        let inputEl = fieldEl.childNodes[3];
        // inputEl.disabled = this.isDisabled;
        // inputEl.required = this.isRequired;

        this.element = fieldEl;
    }
}
export class FieldSelect extends Field {
    constructor(nombre, placeholder, isRequired, isDisabled, isVisible, options = [""]) {
        super(nombre, placeholder, isRequired, isDisabled, isVisible);
        this.options = options;
        this.renderField();
    }
    options;
    renderField() {
        let fieldEl = this.createFieldElement();
        let optionsElements = `<option value="" disabled selected hidden>${this.placeholder}</option>`;
        this.options.forEach(option => {
            let label = option.toLowerCase().split('_').join(' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
            optionsElements += `
            <option id="${option}" value="${option}">${label}</option>`
        });
        fieldEl.innerHTML = `
                <label for="${this.nombre}">${this.label}</label>
                <select id="${this.nombre}" name="${this.nombre}">
                    ${optionsElements}
                </select>
                <span id="error_${this.nombre}" class="error-msj">error del campo</span>`;
        let inputEl = fieldEl.childNodes[3];
        inputEl.disabled = this.isDisabled;
        inputEl.required = this.isRequired;

        this.element = fieldEl;
    }
}