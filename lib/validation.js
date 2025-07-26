// =============================================================================
//                          Validation Library
//                       کتابخانه اعتبارسنجی جامع
// =============================================================================

// =============================================================================
//                           Core Validator Class
// =============================================================================

export class Validator {
  constructor(data, rules, messages = {}) {
    this.data = data;
    this.rules = rules;
    this.messages = messages;
    this.errors = {};
    this.passed = false;
  }

  // اجرای اعتبارسنجی
  validate() {
    this.errors = {};

    for (const field in this.rules) {
      const value = this.getValue(field);
      const fieldRules = this.parseRules(this.rules[field]);

      for (const rule of fieldRules) {
        if (!this.validateRule(field, value, rule)) {
          if (!this.errors[field]) {
            this.errors[field] = [];
          }
          this.errors[field].push(this.getErrorMessage(field, rule));
          break; // متوقف کردن اعتبارسنجی پس از اولین خطا
        }
      }
    }

    this.passed = Object.keys(this.errors).length === 0;
    return this;
  }

  // دریافت مقدار فیلد
  getValue(field) {
    const keys = field.split('.');
    let value = this.data;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  // پارس کردن قوانین
  parseRules(rules) {
    if (typeof rules === 'string') {
      return rules.split('|').map(rule => {
        const [name, ...params] = rule.split(':');
        return {
          name: name.trim(),
          params: params.length > 0 ? params.join(':').split(',').map(p => p.trim()) : []
        };
      });
    }

    if (Array.isArray(rules)) {
      return rules.map(rule => {
        if (typeof rule === 'string') {
          const [name, ...params] = rule.split(':');
          return {
            name: name.trim(),
            params: params.length > 0 ? params.join(':').split(',').map(p => p.trim()) : []
          };
        }
        return rule;
      });
    }

    return [];
  }

  // اعتبارسنجی قانون
  validateRule(field, value, rule) {
    const methodName = `validate${rule.name.charAt(0).toUpperCase() + rule.name.slice(1)}`;
    
    if (typeof this[methodName] === 'function') {
      return this[methodName](value, rule.params, field);
    }

    // بررسی validator های سفارشی
    if (ValidationRules[rule.name]) {
      return ValidationRules[rule.name](value, rule.params, field, this.data);
    }

    throw new Error(`Validation rule "${rule.name}" not found`);
  }

  // دریافت پیام خطا
  getErrorMessage(field, rule) {
    const messageKey = `${field}.${rule.name}`;
    
    if (this.messages[messageKey]) {
      return this.interpolateMessage(this.messages[messageKey], field, rule.params);
    }

    const globalMessageKey = rule.name;
    if (this.messages[globalMessageKey]) {
      return this.interpolateMessage(this.messages[globalMessageKey], field, rule.params);
    }

    return this.getDefaultMessage(field, rule);
  }

  // پیام پیش‌فرض
  getDefaultMessage(field, rule) {
    const messages = {
      required: `${field} الزامی است`,
      string: `${field} باید متن باشد`,
      number: `${field} باید عدد باشد`,
      email: `${field} باید ایمیل معتبر باشد`,
      min: `${field} باید حداقل ${rule.params[0]} کاراکتر باشد`,
      max: `${field} باید حداکثر ${rule.params[0]} کاراکتر باشد`,
      between: `${field} باید بین ${rule.params[0]} تا ${rule.params[1]} کاراکتر باشد`,
      numeric: `${field} باید عدد باشد`,
      integer: `${field} باید عدد صحیح باشد`,
      phone: `${field} باید شماره تلفن معتبر باشد`,
      nationalId: `${field} باید کد ملی معتبر باشد`,
      url: `${field} باید آدرس اینترنتی معتبر باشد`,
      date: `${field} باید تاریخ معتبر باشد`,
      boolean: `${field} باید true یا false باشد`,
      array: `${field} باید آرایه باشد`,
      object: `${field} باید شی باشد`,
      confirmed: `${field} با تایید آن مطابقت ندارد`,
      unique: `${field} قبلاً استفاده شده است`,
      exists: `${field} انتخاب شده معتبر نیست`,
      regex: `فرمت ${field} نامعتبر است`,
      in: `${field} انتخاب شده معتبر نیست`,
      notIn: `${field} انتخاب شده مجاز نیست`
    };

    return messages[rule.name] || `${field} نامعتبر است`;
  }

  // جایگذاری پارامترها در پیام
  interpolateMessage(message, field, params) {
    return message
      .replace(':field', field)
      .replace(':min', params[0])
      .replace(':max', params[0])
      .replace(':value', params[0]);
  }

  // بررسی موفقیت
  passes() {
    return this.passed;
  }

  // بررسی شکست
  fails() {
    return !this.passed;
  }

  // دریافت خطاها
  getErrors() {
    return this.errors;
  }

  // دریافت اولین خطا
  getFirstError(field = null) {
    if (field) {
      return this.errors[field] ? this.errors[field][0]
